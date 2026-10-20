import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SegmentedControl } from "@/components/SegmentedControl";
import type { ImageFormat } from "@/lib/generators";
import { FORMATS, MAX_DIMENSION } from "./constants";

interface ImageOptionsProps {
  format: ImageFormat;
  width: string;
  height: string;
  onFormatChange: (format: ImageFormat) => void;
  onWidthChange: (width: string) => void;
  onHeightChange: (height: string) => void;
}

export function ImageOptions({ format, width, height, onFormatChange, onWidthChange, onHeightChange }: ImageOptionsProps) {
  return (
    <>
      <Field label="Formát">
        <SegmentedControl
          buttonClassName="flex-1 py-1.5 uppercase"
          options={FORMATS}
          value={format}
          onChange={onFormatChange}
          renderLabel={(f) => (f === "jpeg" ? "jpg" : f)}
        />
      </Field>
      <div className="flex items-end gap-2">
        <Field label="Šířka">
          <Input type="number" min={1} max={MAX_DIMENSION} value={width} onChange={(e) => onWidthChange(e.target.value)} />
        </Field>
        <span className="pb-2.5 text-zinc-400">×</span>
        <Field label="Výška">
          <Input type="number" min={1} max={MAX_DIMENSION} value={height} onChange={(e) => onHeightChange(e.target.value)} />
        </Field>
      </div>
    </>
  );
}
