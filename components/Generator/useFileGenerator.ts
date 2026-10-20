import { useEffect, useState } from "react";
import { type GeneratedFile, generateImage, generatePdf, type ImageOptions, type PdfOptions } from "@/lib/generators";

export type GenerateRequest = ({ kind: "pdf" } & PdfOptions) | ({ kind: "image" } & ImageOptions);

function triggerDownload(url: string, fileName: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

export function useFileGenerator() {
  const [result, setResult] = useState<{ file: GeneratedFile; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  const generate = async (request: GenerateRequest) => {
    setError(null);
    setBusy(true);
    try {
      // Let the "Generuji…" state paint before the heavy work starts.
      await new Promise((resolve) => setTimeout(resolve, 0));
      const file = request.kind === "pdf" ? generatePdf(request) : await generateImage(request);

      const url = URL.createObjectURL(file.blob);
      setResult({ file, url });
      triggerDownload(url, file.fileName);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return { generate, result, error, busy };
}
