import { Field } from "@/components/Field";
import { SegmentedControl } from "@/components/SegmentedControl";
import { MAX_BYTES } from "@/lib/generators";
import { formatBytes, formatHuman, UNIT_KEYS, type Unit } from "@/lib/units";
import { PRESETS } from "./constants";

interface SizeInputProps {
  amount: string;
  unit: Unit;
  targetBytes: number;
  valid: boolean;
  onAmountChange: (amount: string) => void;
  onUnitChange: (unit: Unit) => void;
}

export function SizeInput({ amount, unit, targetBytes, valid, onAmountChange, onUnitChange }: SizeInputProps) {
  return (
    <div>
      <Field label="Velikost souboru">
        <div className="flex rounded-2xl border border-zinc-200 bg-white transition focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/15 dark:border-zinc-800 dark:bg-zinc-900">
          <input
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-3xl font-semibold tracking-tight tabular-nums outline-none"
            inputMode="decimal"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />
          <SegmentedControl
            className="m-1.5 shrink-0"
            buttonClassName="px-3"
            options={UNIT_KEYS}
            value={unit}
            onChange={onUnitChange}
          />
        </div>
      </Field>
      <p className={`mt-2 text-xs tabular-nums ${valid ? "text-zinc-500" : "text-red-500"}`}>
        {valid ? `= ${formatBytes(targetBytes)}` : `Zadej kladné číslo, max. ${formatHuman(MAX_BYTES)}`}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const active = preset.amount === amount && preset.unit === unit;
          return (
            <button
              key={`${preset.amount}${preset.unit}`}
              type="button"
              onClick={() => {
                onAmountChange(preset.amount);
                onUnitChange(preset.unit);
              }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                active
                  ? "border-violet-500 bg-violet-500 text-white"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              {preset.amount} {preset.unit}
            </button>
          );
        })}
      </div>
    </div>
  );
}
