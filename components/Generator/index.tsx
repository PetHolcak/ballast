"use client";

import { useState } from "react";
import { ErrorAlert } from "@/components/ErrorAlert";
import { GenerateButton } from "@/components/GenerateButton";
import { ImageOptions } from "@/components/ImageOptions";
import { type Kind, KindPicker } from "@/components/KindPicker";
import { PdfOptions } from "@/components/PdfOptions";
import { Preview } from "@/components/Preview";
import { ResultCard } from "@/components/ResultCard";
import { SizeInput } from "@/components/SizeInput";
import { useFileGenerator } from "./useFileGenerator";
import { type ImageFormat, MAX_BYTES } from "@/lib/generators";
import { formatHuman, toBytes, type Unit } from "@/lib/units";

export function Generator() {
  const [kind, setKind] = useState<Kind>("pdf");
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState<Unit>("MB");
  const [format, setFormat] = useState<ImageFormat>("png");
  const [width, setWidth] = useState("1024");
  const [height, setHeight] = useState("1024");
  const [text, setText] = useState("a");

  const { generate, result, error, busy } = useFileGenerator();

  const targetBytes = toBytes(amount, unit);
  const targetValid = Number.isFinite(targetBytes) && targetBytes > 0 && targetBytes <= MAX_BYTES;

  const handleGenerate = () =>
    generate(
      kind === "pdf"
        ? { kind, targetBytes, text }
        : { kind, targetBytes, width: Number(width), height: Number(height), format },
    );

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white/80 p-5 shadow-xl shadow-zinc-900/5 backdrop-blur-xl sm:p-7 dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-black/40">
      <KindPicker value={kind} onChange={setKind} />

      <div className="mt-7">
        <SizeInput
          amount={amount}
          unit={unit}
          targetBytes={targetBytes}
          valid={targetValid}
          onAmountChange={setAmount}
          onUnitChange={setUnit}
        />
      </div>

      <div className="mt-7 flex gap-5 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950/50">
        <div className="w-16 shrink-0 self-center sm:w-20">
          <Preview kind={kind} text={text} />
        </div>
        <div className="flex-1 space-y-3">
          {kind === "pdf" ? (
            <PdfOptions text={text} onTextChange={setText} />
          ) : (
            <ImageOptions
              format={format}
              width={width}
              height={height}
              onFormatChange={setFormat}
              onWidthChange={setWidth}
              onHeightChange={setHeight}
            />
          )}
        </div>
      </div>

      <div className="mt-7 space-y-4">
        <GenerateButton
          label={`Vygenerovat ${targetValid ? formatHuman(targetBytes) : ""}`}
          busy={busy}
          disabled={!targetValid}
          onClick={handleGenerate}
        />
        {error && <ErrorAlert message={error} />}
        {result && !error && <ResultCard file={result.file} url={result.url} />}
      </div>
    </div>
  );
}
