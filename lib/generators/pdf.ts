import type { GeneratedFile } from "./types";

export interface PdfOptions {
  targetBytes: number;
  text: string;
}

const PAGE = { width: 595, height: 842 }; // A4 in points
const MARGIN = 40;
const FONT_SIZE = 9;
const LEADING = 12;
const LINE_CHARS = 90;
const LINES_PER_PAGE = 64;
const CHARS_PER_PAGE = LINE_CHARS * LINES_PER_PAGE;

const CATALOG_ID = 1;
const PAGES_ID = 2;
const FONT_ID = 3;
const FIRST_PAGE_ID = 4; // each page takes two ids: the page and its content stream

/**
 * Collects PDF objects as strings and records their byte offsets for the xref table.
 * Everything written must be ASCII, so string length equals byte length.
 */
class PdfWriter {
  readonly parts: string[] = [];
  #size = 0;
  #offsets: number[] = [];

  get size() {
    return this.#size;
  }

  write(chunk: string) {
    this.parts.push(chunk);
    this.#size += chunk.length;
  }

  object(id: number, body: string) {
    this.#offsets[id] = this.#size;
    this.write(`${id} 0 obj\n${body}\nendobj\n`);
  }

  finish(rootId: number) {
    const xrefOffset = this.#size;
    const count = this.#offsets.length; // ids start at 1, slot 0 is the free-list head
    const entries = this.#offsets
      .slice(1)
      .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
      .join("");

    this.write(`xref\n0 ${count}\n0000000000 65535 f \n${entries}`);
    this.write(`trailer\n<< /Size ${count} /Root ${rootId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);
  }
}

/** A PDF comment of exactly `bytes` bytes (a lone newline when there's no room for `%`). */
const comment = (bytes: number) => (bytes === 0 ? "" : bytes === 1 ? "\n" : `%${"a".repeat(bytes - 2)}\n`);

function pageStream(chars: number, line: string) {
  const fullLines = `(${line}) Tj T*\n`.repeat(Math.floor(chars / LINE_CHARS));
  const rest = chars % LINE_CHARS;
  const lastLine = rest > 0 ? `(${line.slice(0, rest)}) Tj T*\n` : "";
  return `BT\n/F1 ${FONT_SIZE} Tf\n${LEADING} TL\n${MARGIN} ${PAGE.height - MARGIN} Td\n${fullLines}${lastLine}ET\n`;
}

function buildPdf(chars: number, line: string, padBytes = 0) {
  const pageCount = Math.max(1, Math.ceil(chars / CHARS_PER_PAGE));
  const pageIds = Array.from({ length: pageCount }, (_, i) => FIRST_PAGE_ID + i * 2);
  const pdf = new PdfWriter();

  pdf.write(`%PDF-1.4\n${comment(padBytes)}`);
  pdf.object(CATALOG_ID, `<< /Type /Catalog /Pages ${PAGES_ID} 0 R >>`);
  pdf.object(PAGES_ID, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`);
  pdf.object(FONT_ID, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  pageIds.forEach((pageId, i) => {
    const stream = pageStream(Math.min(CHARS_PER_PAGE, chars - i * CHARS_PER_PAGE), line);
    pdf.object(
      pageId,
      `<< /Type /Page /Parent ${PAGES_ID} 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] ` +
        `/Resources << /Font << /F1 ${FONT_ID} 0 R >> >> /Contents ${pageId + 1} 0 R >>`,
    );
    pdf.object(pageId + 1, `<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
  });

  pdf.finish(CATALOG_ID);
  return { parts: pdf.parts, size: pdf.size, pageCount };
}

/** Most characters whose PDF still fits into `target` bytes. The size grows (almost) linearly with the text. */
function fitChars(target: number, line: string) {
  const sizeOf = (chars: number) => buildPdf(chars, line).size;

  // Marginal cost of one more full page (text + page objects + xref entries), spread over its characters.
  const onePage = sizeOf(CHARS_PER_PAGE);
  const bytesPerChar = (sizeOf(2 * CHARS_PER_PAGE) - onePage) / CHARS_PER_PAGE;
  let chars = Math.max(0, Math.floor((target - sizeOf(0)) / bytesPerChar));

  // The linear estimate is off by a few bytes at most; step back until it fits.
  for (let size = sizeOf(chars); size > target; size = sizeOf(chars)) {
    chars = Math.max(0, chars - Math.ceil((size - target) / bytesPerChar));
  }
  return chars;
}

const isSafePdfText = (text: string) => /^[ -~]+$/.test(text) && !/[()\\]/.test(text);

const PAGE_WORDS: Partial<Record<Intl.LDMLPluralRule, string>> = { one: "strana", few: "strany" };
const pluralRules = new Intl.PluralRules("cs");
const pagesLabel = (count: number) => `${count} ${PAGE_WORDS[pluralRules.select(count)] ?? "stran"}`;

export function generatePdf({ targetBytes, text }: PdfOptions): GeneratedFile {
  if (!isSafePdfText(text)) {
    throw new Error("Text smí obsahovat jen ASCII znaky bez závorek a zpětného lomítka.");
  }

  const line = text.repeat(Math.ceil(LINE_CHARS / text.length)).slice(0, LINE_CHARS);
  const minSize = buildPdf(0, line).size;
  if (targetBytes < minSize) throw new Error(`Nejmenší možné PDF má ${minSize} B.`);

  // Fit as much text as possible, then top up the last few bytes with a comment.
  const chars = fitChars(targetBytes, line);
  const padBytes = targetBytes - buildPdf(chars, line).size;
  const { parts, pageCount } = buildPdf(chars, line, padBytes);

  return {
    blob: new Blob(parts, { type: "application/pdf" }),
    fileName: `text-${targetBytes}B.pdf`,
    details: `${pagesLabel(pageCount)}, ${chars.toLocaleString("cs-CZ")} znaků`,
  };
}
