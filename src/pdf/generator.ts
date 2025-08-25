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
    const imagePage = imageDoc.addPage([595.28, 841.89]); // A4 portrait
    const font = await imageDoc.embedFont(StandardFonts.Helvetica);
    const bold = await imageDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add title
    imagePage.drawText('Visit Images', { 
      x: 50, 
      y: 800, 
      size: 18, 
      font: bold, 
      color: rgb(0,0,0) 
    });
    
    // Add images in a grid
    let imageY = 750;
    const imageWidth = 150;
    const imageHeight = 100;
    const imagesPerRow = 3;
    
    for (let i = 0; i < data.images.length; i++) {
      const img = data.images[i];
      if (img.public_url) {
        try {
          const pdfImage = await embedImageFromUrl(img.public_url);
          if (pdfImage) {
            const row = Math.floor(i / imagesPerRow);
            const col = i % imagesPerRow;
            const x = 50 + col * (imageWidth + 20);
            const y = imageY - row * (imageHeight + 40);
            
            // Check if we need a new page
            if (y < 100) {
              const newPage = imageDoc.addPage([595.28, 841.89]);
              imageY = 750;
              const newRow = Math.floor(i / imagesPerRow);
              const newCol = i % imagesPerRow;
              const newX = 50 + newCol * (imageWidth + 20);
              const newY = imageY - newRow * (imageHeight + 40);
              
              newPage.drawImage(pdfImage, {
                x: newX,
                y: newY,
                width: imageWidth,
                height: imageHeight,
              });
              
              // Add image description below
              const description = img.description || img.original_name;
              newPage.drawText(description, {
                x: newX + 5,
                y: newY - 15,
                size: 8,
                font,
                color: rgb(0.5, 0.5, 0.5),
              });
            } else {
              imagePage.drawImage(pdfImage, {
                x,
                y,
                width: imageWidth,
                height: imageHeight,
              });
              
              // Add image description below
              const description = img.description || img.original_name;
              imagePage.drawText(description, {
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


