const TABLE = Uint32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

/** CRC-32 (as used by PNG chunks) over the concatenation of all `chunks`. */
export function crc32(...chunks: Uint8Array[]): number {
  let crc = ~0;
  for (const bytes of chunks) {
    for (const byte of bytes) crc = TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return ~crc >>> 0;
}
