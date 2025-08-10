import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { headerCoords, sectionCoords, templatePaths, SectionMap, pageToPath } from './coordinates';

export type VisitExport = {
  schoolName: string
  visitDate: string
  sections: Array<{
    code: '1' | '2' | '3.1' | '3.2' | '3.3' | string
    score?: number | null
    evidences?: boolean[]
    remarks?: string | null
  }>
}

async function fetchArrayBuffer(path: string): Promise<ArrayBuffer> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load template: ${path}`);
  return res.arrayBuffer();
}

function drawMultilineText(page: any, text: string, map: SectionMap['remarks'], font: any) {
  if (!map || !text) return;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    const width = font.widthOfTextAtSize(test, 10);
    if (width > map.maxWidth) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => {
    page.drawText(l, { x: map.x, y: map.y - i * map.lineHeight, size: 10, font, color: rgb(0,0,0) });
  });
}

export async function generateBorangPdf(data: VisitExport): Promise<Blob> {
  const pdfs: PDFDocument[] = [];
  for (const s of data.sections) {
    const path = templatePaths[s.code] || pageToPath(s.code as any);
    const bytes = await fetchArrayBuffer(path);
    const doc = await PDFDocument.load(bytes);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const page = doc.getPages()[0];
    // header on each page
    page.drawText(data.schoolName ?? '', { x: headerCoords.schoolName.x, y: headerCoords.schoolName.y, size: 10, font, color: rgb(0,0,0) });
    page.drawText(data.visitDate ?? '', { x: headerCoords.visitDate.x, y: headerCoords.visitDate.y, size: 10, font, color: rgb(0,0,0) });

    const coords = sectionCoords[s.code];
    if (coords?.score && typeof s.score === 'number') {
      page.drawText(String(s.score), { x: coords.score.x, y: coords.score.y, size: 10, font });
    }
    if (coords?.evidences && Array.isArray(s.evidences)) {
      s.evidences.forEach((checked, idx) => {
        const pos = coords.evidences![idx];
        if (pos && checked) {
          page.drawRectangle({ x: pos.x, y: pos.y, width: 8, height: 8, color: rgb(0,0,0) });
        }
      });
    }
    if (coords?.remarks && s.remarks) {
      drawMultilineText(page, s.remarks, coords.remarks, font);
    }
    pdfs.push(doc);
  }

  // Merge to one document
  const outDoc = await PDFDocument.create();
  for (const part of pdfs) {
    const [page] = await outDoc.copyPages(part, [0]);
    outDoc.addPage(page);
  }
  const out = await outDoc.save();
  return new Blob([out], { type: 'application/pdf' });
}


