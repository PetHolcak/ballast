import { ImageIcon, PdfIcon } from "@/components/Icons";
import { KindCard } from "@/components/KindCard";

export type Kind = "image" | "pdf";

export function KindPicker({ value, onChange }: { value: Kind; onChange: (kind: Kind) => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <KindCard
        active={value === "pdf"}
        onClick={() => onChange("pdf")}
        icon={<PdfIcon className="size-5" />}
        title="PDF s textem"
      />
      <KindCard
        active={value === "image"}
        onClick={() => onChange("image")}
        icon={<ImageIcon className="size-5" />}
        title="Černý obrázek"
      />
    </div>
  );
}
