import type { ReactNode } from "react";

interface KindCardProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
}

export function KindCard({ active, onClick, icon, title }: KindCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-1 items-center gap-3 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-violet-500 bg-violet-500/10 ring-4 ring-violet-500/15"
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
      }`}
    >
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-xl transition ${
          active
            ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
            : "bg-zinc-100 text-zinc-500 group-hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200"
        }`}
      >
        {icon}
      </span>
      <span className="text-sm font-semibold">{title}</span>
    </button>
  );
}
