import { Field } from "@/components/Field";
import { Input } from "@/components/Input";

export function PdfOptions({ text, onTextChange }: { text: string; onTextChange: (text: string) => void }) {
  return (
    <Field label="Výplňový text">
      <Input className="font-mono" value={text} onChange={(e) => onTextChange(e.target.value)} />
    </Field>
  );
}
