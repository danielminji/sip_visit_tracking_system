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

async function embedImageFromUrl(url: string): Promise<PDFImage | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Try to determine image format from URL or content
    if (url.includes('.jpg') || url.includes('.jpeg')) {
      return await PDFImage.embed(uint8Array, 'jpeg');
    } else if (url.includes('.png')) {
      return await PDFImage.embed(uint8Array, 'png');
    } else {
      // Default to JPEG
      return await PDFImage.embed(uint8Array, 'jpeg');
    }
  } catch (error) {
    console.error('Failed to embed image:', error);
    return null;
  }
}

export async function generateBorangPdf(data: VisitExport): Promise<Blob> {
  const pdfs: PDFDocument[] = [];
  
  // Group images by section code
  const imagesBySection = (data.images || []).reduce((acc, img) => {
    const sectionCode = img.section_code || 'general';
    if (!acc[sectionCode]) acc[sectionCode] = [];
    acc[sectionCode].push(img);
    return acc;
  }, {} as Record<string, typeof data.images>);

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

    // Add images for this section
    const sectionImages = imagesBySection[s.code] || [];
    if (sectionImages.length > 0) {
      // Add images at the bottom of the page
      let imageY = 100; // Start position for images
      const imageWidth = 150;
      const imageHeight = 100;
      const imagesPerRow = 3;
      
      for (let i = 0; i < sectionImages.length; i++) {
        const img = sectionImages[i];
        if (img.public_url) {
          try {
            const pdfImage = await embedImageFromUrl(img.public_url);
            if (pdfImage) {
              const row = Math.floor(i / imagesPerRow);
              const col = i % imagesPerRow;
              const x = 50 + col * (imageWidth + 20);
              const y = imageY - row * (imageHeight + 30);
              
              page.drawImage(pdfImage, {
                x,
                y,
                width: imageWidth,
                height: imageHeight,
              });
              
              // Add image description below
              if (img.description) {
                page.drawText(img.description, {
                  x: x + 5,
                  y: y - 15,
                  size: 8,
                  font,
                  color: rgb(0.5, 0.5, 0.5),
                });
              }
            }
          } catch (error) {
            console.error('Failed to add image to PDF:', error);
          }
        }
      }
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


