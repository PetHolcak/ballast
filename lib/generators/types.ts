export type ImageFormat = "png" | "jpeg";

export interface GeneratedFile {
  blob: Blob;
  fileName: string;
  details: string;
}

export const MAX_BYTES = 512 * 1024 * 1024;
