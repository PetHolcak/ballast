import type { Unit } from "@/lib/units";

export const PRESETS: { amount: string; unit: Unit }[] = [
  { amount: "100", unit: "kB" },
  { amount: "500", unit: "kB" },
  { amount: "1", unit: "MB" },
  { amount: "5", unit: "MB" },
  { amount: "10", unit: "MB" },
  { amount: "50", unit: "MB" },
];
