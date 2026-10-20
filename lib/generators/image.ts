import { crc32 } from "./crc32";
import type { GeneratedFile, ImageFormat } from "./types";

export interface ImageOptions {
  targetBytes: number;
  width: number;
  height: number;
  format: ImageFormat;
}

type Bytes = Uint8Array<ArrayBuffer>;

const MAX_ATTEMPTS = 50;

const uint32 = (value: number) => {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value);
  return bytes;
};

// PNG: a private ancillary chunk "fiLl" right before IEND. Viewers skip unknown ancillary chunks.
const PNG_CHUNK_OVERHEAD = 12; // length + type + CRC
const PNG_IEND_SIZE = 12;

function padPng(base: Bytes, padBytes: number): BlobPart[] {
  const type = new TextEncoder().encode("fiLl");
  const data = new Uint8Array(padBytes - PNG_CHUNK_OVERHEAD);
  const iendStart = base.length - PNG_IEND_SIZE;
  return [
    base.subarray(0, iendStart),
    uint32(data.length),
    type,
    data,
    uint32(crc32(type, data)),
    base.subarray(iendStart),
  ];
}

// JPEG: COM (comment) segments right after the SOI marker.
const JPEG_SEGMENT_OVERHEAD = 4; // marker + length field
const JPEG_SEGMENT_MAX = 2 + 0xffff; // marker + max value of the length field

/** Splits `total` into segment sizes, never leaving a remainder too small for its own segment. */
function* jpegSegmentSizes(total: number) {
  let remaining = total;
  while (remaining > 0) {
    let size = Math.min(remaining, JPEG_SEGMENT_MAX);
    const leftover = remaining - size;
    if (leftover > 0 && leftover < JPEG_SEGMENT_OVERHEAD) size -= JPEG_SEGMENT_OVERHEAD;
    yield size;
    remaining -= size;
  }
}

function padJpeg(base: Bytes, padBytes: number): BlobPart[] {
  const filler = new Uint8Array(JPEG_SEGMENT_MAX - JPEG_SEGMENT_OVERHEAD).fill(0x61); // 'a'
  const segments = [...jpegSegmentSizes(padBytes)].flatMap((size) => {
    const length = size - 2; // the length field counts itself, not the marker
    return [Uint8Array.of(0xff, 0xfe, length >> 8, length & 0xff), filler.subarray(0, size - JPEG_SEGMENT_OVERHEAD)];
  });
  return [base.subarray(0, 2), ...segments, base.subarray(2)];
}

const FORMATS = {
  png: { mime: "image/png", extension: "png", minPadding: PNG_CHUNK_OVERHEAD, pad: padPng },
  jpeg: { mime: "image/jpeg", extension: "jpg", minPadding: JPEG_SEGMENT_OVERHEAD, pad: padJpeg },
} satisfies Record<ImageFormat, { mime: string; extension: string; minPadding: number; pad: typeof padPng }>;

async function renderBlack(width: number, height: number, mime: string): Promise<Bytes> {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D není dostupný.");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  const blob = await canvas.convertToBlob({ type: mime, quality: 0.92 });
  return blob.bytes();
}

export async function generateImage({ targetBytes, width, height, format }: ImageOptions): Promise<GeneratedFile> {
  const { mime, extension, minPadding, pad } = FORMATS[format];

  // A gap smaller than one padding block can't be filled, so nudge the height until the encoded size shifts.
  for (let attempt = 0, h = height; attempt < MAX_ATTEMPTS; attempt++, h = h > 1 ? h - 1 : h + 1) {
    const base = await renderBlack(width, h, mime);
    const padBytes = targetBytes - base.length;

    if (padBytes < 0) {
      throw new Error(
        `Prázdný černý obrázek ${width}×${h} má už ${base.length} B. Zmenši rozměry nebo zvětši cílovou velikost.`,
      );
    }
    if (padBytes > 0 && padBytes < minPadding) continue;

    return {
      blob: new Blob(padBytes > 0 ? pad(base, padBytes) : [base], { type: mime }),
      fileName: `black-${width}x${h}-${targetBytes}B.${extension}`,
      details: `${width}×${h} px${h !== height ? " (výška upravena kvůli přesné velikosti)" : ""}`,
    };
  }

  throw new Error("Nepodařilo se trefit přesnou velikost, zkus jiné rozměry.");
}
