import type { Kind } from "@/components/KindPicker";

export function Preview({ kind, text }: { kind: Kind; text: string }) {
  if (kind === "image") {
    return <div className="aspect-square w-full rounded-lg bg-black shadow-inner ring-1 ring-white/10" />;
  }

  const line = (text || "a").repeat(40);
  return (
    <div className="aspect-a4 w-full overflow-hidden rounded-lg bg-white p-2 shadow-md ring-1 ring-zinc-200 dark:ring-zinc-700">
      {Array.from({ length: 14 }, (_, i) => (
        <p key={i} className="truncate font-mono text-micro text-zinc-400">
          {line}
        </p>
      ))}
    </div>
  );
}
