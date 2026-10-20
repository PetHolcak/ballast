import { DownloadIcon } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";

interface GenerateButtonProps {
  label: string;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function GenerateButton({ label, busy, disabled, onClick }: GenerateButtonProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:brightness-110 active:scale-99 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      disabled={disabled || busy}
      onClick={onClick}
    >
      {busy ? <Spinner /> : <DownloadIcon className="size-4" />}
      {busy ? "Generuji…" : label}
    </button>
  );
}
