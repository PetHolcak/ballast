export const UNITS = {
  B: 1,
  kB: 1000,
  MB: 1000 ** 2,
} as const;

export type Unit = keyof typeof UNITS;

export const UNIT_KEYS = Object.keys(UNITS) as Unit[];

export const toBytes = (amount: string, unit: Unit) => Math.round(Number(amount.replace(",", ".")) * UNITS[unit]);

export const formatBytes = (bytes: number) => `${bytes.toLocaleString("cs-CZ")} B`;

export const formatHuman = (bytes: number) => {
  if (bytes >= UNITS.MB) return `${(bytes / UNITS.MB).toLocaleString("cs-CZ", { maximumFractionDigits: 2 })} MB`;
  if (bytes >= UNITS.kB) return `${(bytes / UNITS.kB).toLocaleString("cs-CZ", { maximumFractionDigits: 2 })} kB`;
  return `${bytes} B`;
};
