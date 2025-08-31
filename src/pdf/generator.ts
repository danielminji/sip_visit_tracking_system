import { PDFDocument, StandardFonts, rgb, PDFImage } from 'pdf-lib';
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
  images?: Array<{
    id: string
    filename: string
    original_name: string
    description?: string
    section_code?: string
    public_url?: string
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

async function embedImageFromUrl(doc: PDFDocument, url: string): Promise<PDFImage | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.statusText}`);
      return null;
    }
    const contentType = response.headers.get('content-type');
    const arrayBuffer = await response.arrayBuffer();

    if (contentType?.includes('jpeg') || contentType?.includes('jpg')) {
      return await doc.embedJpg(arrayBuffer);
    }
    if (contentType?.includes('png')) {
      return await doc.embedPng(arrayBuffer);
    }

    // Fallback to guessing from URL
    if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
      return await doc.embedJpg(arrayBuffer);
    }
    if (url.endsWith('.png')) {
      return await doc.embedPng(arrayBuffer);
    }

    console.warn(`Unknown image type for ${url}, attempting to embed as JPG.`);
    return await doc.embedJpg(arrayBuffer);
  } catch (error) {
    console.error(`Failed to embed image from ${url}:`, error);
    return null;
  }
}

export async function generateBorangPdf(data: VisitExport): Promise<Blob> {
  const pdfs: PDFDocument[] = [];
  
  // Create a PDF for each section that has data
  for (const s of data.sections) {
    // Skip sections without meaningful data
    const hasData = s.score !== undefined || 
                   s.remarks || 
                   (s.evidences && s.evidences.some(Boolean));
    
    if (!hasData) continue;
    
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

  // Add a separate page for images if there are any
  if (data.images && data.images.length > 0) {
    const imageDoc = await PDFDocument.create();
    let currentPage = imageDoc.addPage([595.28, 841.89]); // A4 portrait
    const font = await imageDoc.embedFont(StandardFonts.Helvetica);
    const bold = await imageDoc.embedFont(StandardFonts.HelveticaBold);

    currentPage.drawText('Visit Images', { x: 50, y: 800, size: 18, font: bold });

    const margin = 50;
    const gutter = 20;
    const imageWidth = (currentPage.getWidth() - margin * 2 - gutter * 2) / 3;
    const imageHeight = imageWidth * (2 / 3);
    const textHeight = 30;
    const totalImageBlockHeight = imageHeight + textHeight;

    let x = margin;
    let y = 750;

    for (const img of data.images) {
      if (!img.public_url) continue;

      if (y - totalImageBlockHeight < margin) {
        currentPage = imageDoc.addPage([595.28, 841.89]);
        x = margin;
        y = 800;
        currentPage.drawText('Visit Images (continued)', { x: 50, y: y, size: 18, font: bold });
        y -= 50;
      }

      const pdfImage = await embedImageFromUrl(imageDoc, img.public_url);
      if (pdfImage) {
        const scaled = pdfImage.scaleToFit(imageWidth, imageHeight);
        currentPage.drawImage(pdfImage, {
          x,
          y: y - scaled.height,
          width: scaled.width,
          height: scaled.height,
        });

        const description = img.description || img.original_name;
        drawMultilineText(currentPage, description, {
          x,
          y: y - scaled.height - 15,
          maxWidth: imageWidth,
          lineHeight: 10,
        }, font);
      }

      x += imageWidth + gutter;
      if (x + imageWidth > currentPage.getWidth() - margin) {
        x = margin;
        y -= totalImageBlockHeight;
      }
    }
    pdfs.push(imageDoc);
  }

  // Merge to one document
  const outDoc = await PDFDocument.create();
  for (const part of pdfs) {
    const pages = await outDoc.copyPages(part, part.getPageIndices());
    pages.forEach(page => outDoc.addPage(page));
  }
  const out = await outDoc.save();
  return new Blob([out], { type: 'application/pdf' });
}


