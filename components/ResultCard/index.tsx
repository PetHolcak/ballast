import { DownloadIcon, ImageIcon, PdfIcon } from "@/components/Icons";
import type { GeneratedFile } from "@/lib/generators";
import { formatBytes } from "@/lib/units";

export function ResultCard({ file, url }: { file: GeneratedFile; url: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/60 dark:bg-emerald-950/40">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white">
        {file.blob.type === "application/pdf" ? <PdfIcon className="size-5" /> : <ImageIcon className="size-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-emerald-900 dark:text-emerald-100">{file.fileName}</p>
        <p className="text-xs text-emerald-700 tabular-nums dark:text-emerald-400">
          {formatBytes(file.blob.size)} · {file.details}
        </p>
      </div>
      <a
        className="grid size-9 shrink-0 place-items-center rounded-xl text-emerald-700 transition hover:bg-emerald-500/15 dark:text-emerald-300"
        href={url}
        download={file.fileName}
        title="Stáhnout znovu"
      >
        <DownloadIcon className="size-4" />
      </a>
    </div>
  );
}
