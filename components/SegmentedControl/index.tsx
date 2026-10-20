import type { ReactNode } from "react";

interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  renderLabel?: (option: T) => ReactNode;
  className?: string;
  buttonClassName?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  renderLabel = (option) => option,
  className = "",
  buttonClassName = "",
}: SegmentedControlProps<T>) {
  return (
    <div className={`flex gap-1 rounded-xl bg-zinc-200/60 p-1 dark:bg-zinc-800 ${className}`}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-lg text-sm font-medium transition ${buttonClassName} ${
            value === option
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-600 dark:text-white"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          {renderLabel(option)}
        </button>
      ))}
    </div>
  );
}
