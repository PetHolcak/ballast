import type { ImageFormat } from "@/lib/generators";

export const FORMATS = ["png", "jpeg"] as const satisfies readonly ImageFormat[];

export const MAX_DIMENSION = 8000;
