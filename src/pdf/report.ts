// Import PDF-lib synchronously to prevent dynamic import issues
import { PDFDocument, StandardFonts, rgb, PDFImage } from 'pdf-lib'
import { standardsConfig } from '@/standards/config'

// Add error handling wrapper
const safeImport = async (importFn: () => Promise<any>) => {
  try {
    return await importFn();
  } catch (error) {
    console.error('Failed to import PDF module:', error);
    throw new Error('PDF generation module failed to load. Please refresh the page and try again.');
  }
};

type SectionInput = {
  standardCode: '1'|'2'|'3.1'|'3.2'|'3.3'
  pageCode: string
  title: string
  plan: string[]
  doText?: string
  actText?: string
  checklistLabels: string[]
  checklistChecked: boolean[]
  evidenceLabels: string[]
  evidenceChecked: boolean[]
  score?: number|null
  remarks?: string
  lainLainText?: string
}

export type ReportExport = {
  schoolName: string
  visitDate: string
  officerName?: string
  pgb?: string
  sesiBimbingan?: string
  sections: SectionInput[]
  images?: Array<{
    id: string
    filename: string
    original_name: string
    description?: string
    section_code?: string
    public_url?: string
  }>
}

function wrapText(text: string, maxWidth: number, font: any, size: number): string[] {
  const words = (text || '').split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      if (line) lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

async function embedImageFromUrl(url: string, doc: PDFDocument): Promise<PDFImage | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Try to determine image format from URL or content
    if (url.includes('.jpg') || url.includes('.jpeg')) {
      return await doc.embedJpg(uint8Array);
    } else if (url.includes('.png')) {
      return await doc.embedPng(uint8Array);
    } else {
      // Default to JPEG
      return await doc.embedJpg(uint8Array);
    }
  } catch (error) {
    console.error('Failed to embed image:', error);
    return null;
  }
}

export async function generateVisitReportPdf(data: ReportExport): Promise<Blob> {
  try {
    const doc = await PDFDocument.create()
  let page = doc.addPage([595.28, 841.89]) // A4 portrait
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  let x = 50
  let y = 800
  const lineHeight = 14
  const contentWidth = 495

  const draw = (text: string, options?: { size?: number; bold?: boolean }) => {
    const size = options?.size ?? 11
    const f = options?.bold ? bold : font
    page.drawText(text, { x, y, size, font: f, color: rgb(0,0,0) })
    y -= size + 4
  }
  const drawWrapped = (text: string, options?: { size?: number; bullet?: string }) => {
    const size = options?.size ?? 11
    const f = font
    const lines = wrapText(text, contentWidth, f, size)
    lines.forEach((l, idx) => {
      const prefix = options?.bullet && idx === 0 ? `${options.bullet} ` : ''
      page.drawText(prefix + l, { x, y, size, font: f, color: rgb(0,0,0) })
      y -= size + 3
    })
  }
  const ensureRoom = (needed: number = lineHeight) => {
    if (y - needed < 40) {
      const p = doc.addPage([595.28, 841.89])
      y = 800
      // reset page reference
      page = p
      // re-draw header bar on new page if desired
    }
  }

  // Header
  draw('SIP+ Visit Report', { size: 18, bold: true })
  ensureRoom()
  draw(`Sekolah: ${data.schoolName || '-'}`)
  draw(`Tarikh: ${data.visitDate || '-'}`)
  if (data.officerName) draw(`Nama Pegawai: ${data.officerName}`)
  if (data.pgb) draw(`PGB: ${data.pgb}`)
  if (data.sesiBimbingan) draw(`Sesi Bimbingan: ${data.sesiBimbingan}`)

  // Images section - place all images at the top after personal information
  if (data.images && data.images.length > 0) {
    ensureRoom(250); // Ensure enough room for a large image + padding
    draw('IMAGES:', { bold: true });
    y -= 20; // More space after IMAGES heading
    
    const imageIndent = 20; // Indent from the left margin
    const imageWidth = 400; // Wider image (e.g., 16:9 aspect ratio with height 225)
    const imageHeight = 225; // Height for 16:9 aspect ratio
    
    for (const img of data.images) {
      try {
        const pdfImage = await embedImageFromUrl(img.public_url || '', doc);
        if (pdfImage) {
          ensureRoom(imageHeight + 40); // Ensure room for image + space below it
          
          // Draw the image with indent
          page.drawImage(pdfImage, {
            x: x + imageIndent,
            y: y - imageHeight,
            width: imageWidth,
            height: imageHeight,
          });
          
          // Add image description below with more space
          const description = img.description || img.original_name;
          const descLines = wrapText(description, imageWidth, font, 9);
          descLines.forEach((line, idx) => {
            page.drawText(line, {
              x: x + imageIndent,
              y: y - imageHeight - 20 - (idx * 12),
              size: 9,
              font,
              color: rgb(0.5, 0.5, 0.5),
            });
          });
          
          y -= (imageHeight + 40); // Move y down for the next image, with space
        }
      } catch (error) {
        console.error('Failed to embed image:', error);
        // Fallback to text if image embedding fails
        ensureRoom(30);
        drawWrapped(`• ${img.description || img.original_name} (image not available)`, { bullet: undefined });
        y -= 30;
      }
    }
    
    y -= 20; // Add additional space after the entire image section
  }

  // Sections - include ALL forms, not just those with content
  for (const s of data.sections) {
    ensureRoom(28)
    
    // Split title into main title and subtitle
    // Handle different title formats:
    // Format 1: "ASPEK 1.1: PGB SEBAGAI PENERAJU 1.1.1 PGB menetapkan..."
    // Format 2: "ASPEK 3.1.1: KETETAPAN PELAKSANAAN KURIKULUM 3.1.1.1 Pelaksanaan..."
    
    let mainTitle = s.title
    let subtitle = ''
    
    // Check if it's format 1 (ASPEK X.X: description X.X.X subtitle)
    const format1Match = s.title.match(/^(ASPEK \d+\.\d+: [^0-9]+) (\d+\.\d+\.\d+ .+)$/)
    if (format1Match) {
      mainTitle = format1Match[1]
      subtitle = format1Match[2]
    } else {
      // Check if it's format 2 (ASPEK X.X.X: description X.X.X.X subtitle)
      const format2Match = s.title.match(/^(ASPEK \d+\.\d+\.\d+: [^0-9]+) (\d+\.\d+\.\d+\.\d+ .+)$/)
      if (format2Match) {
        mainTitle = format2Match[1]
        subtitle = format2Match[2]
      }
    }
    
    // Display main title in bold
    draw(mainTitle, { bold: true })
    
    // Display subtitle if it exists
    if (subtitle) {
      draw(subtitle, { size: 10 })
    }
    
    if (typeof s.score === 'number') draw(`Skor: ${s.score}`)

    // PLAN
    if (s.plan && s.plan.length > 0) {
      ensureRoom()
      draw('PLAN:', { bold: true })
      // Split alphabetized a)/b) items into separate lines
      const formatted = s.plan[0].replace(/\s+([a-z]\))/gi, '\n$1')
      formatted.split('\n').forEach((line) => {
        if (line.trim().length === 0) return
        drawWrapped(line.trim(), { bullet: line.trim().match(/^[a-z]\)/i) ? '•' : undefined })
      })
      y -= 8 // Add space after PLAN
    }

    // DO
    ensureRoom()
    draw('DO:', { bold: true })
    if (s.doText && s.doText.trim()) {
      drawWrapped(s.doText)
    } else {
      drawWrapped('No implementation details provided')
    }
    y -= 8 // Add space after DO

    // CHECK
    if (s.checklistLabels && s.checklistLabels.length > 0) {
      ensureRoom()
      draw('CHECK:', { bold: true })
      s.checklistLabels.forEach((label, idx) => {
        const checked = s.checklistChecked[idx] ? '[X]' : '[ ]'
        drawWrapped(`${checked} ${label}`)
      })
      y -= 8 // Add space after CHECK
    }

    // ACT
    ensureRoom()
    draw('ACT:', { bold: true })
    if (s.actText && s.actText.trim()) {
      drawWrapped(s.actText)
    } else {
      drawWrapped('No follow-up actions provided')
    }
    y -= 8 // Add space after ACT

    // EVIDENCE
    if (s.evidenceLabels && s.evidenceLabels.length > 0) {
      ensureRoom()
      draw('EVIDENCE:', { bold: true })
      s.evidenceLabels.forEach((label, idx) => {
        const checked = s.evidenceChecked[idx] ? '[X]' : '[ ]'
        drawWrapped(`${checked} ${label}`)
      })
      y -= 8 // Add space after EVIDENCE
    }

    // REMARKS
    if (s.remarks && s.remarks.trim()) {
      ensureRoom()
      draw('REMARKS:', { bold: true })
      drawWrapped(s.remarks)
      y -= 8 // Add space after REMARKS
    }

    // LAIN-LAIN
    if (s.lainLainText && s.lainLainText.trim()) {
      ensureRoom()
      draw('LAIN-LAIN:', { bold: true })
      drawWrapped(s.lainLainText)
      y -= 8 // Add space after LAIN-LAIN
    }

    y -= 15 // Add space between sections
  }

  const bytes = await doc.save()
  return new Blob([bytes], { type: 'application/pdf' })
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF. Please try again or contact support if the issue persists.');
  }
}

// Helper to build SectionInput rows for current in-memory state (used by VisitForm)
export function buildReportSectionsFromState(localSections: any, pageIndex: Record<string, number>) {
  const out: SectionInput[] = []
  
  // Get all standards from config, not just from pageIndex
  const allStandards = ['1', '2', '3.1', '3.2', '3.3'] as const
  
  for (const std of allStandards) {
    const stdCfg = standardsConfig[std]
    if (!stdCfg) continue
    
    // Get all pages for this standard
    const standardPages = stdCfg.pages || []
    
    for (const page of standardPages) {
      const pageKey = `${std}-${page.code}`;
      const pageSection = localSections[pageKey];
      
      if (!pageSection) continue;
      
      const ev = (pageSection.evidences ?? []) as boolean[]
      const checkLen = page.check?.checkboxes?.length ?? 0
      const evidenceLen = page.evidenceLabels?.length ?? 0
      
      // Only include pages that have meaningful data (not blank forms)
      const hasMeaningfulData = 
        (pageSection.doText && pageSection.doText.trim().length > 0) ||
        (pageSection.actText && pageSection.actText.trim().length > 0) ||
        (pageSection.score !== undefined && pageSection.score !== null) ||
        (pageSection.evidences && pageSection.evidences.some(Boolean)) ||
        (pageSection.remarks && pageSection.remarks.trim().length > 0) ||
        (pageSection.lainLainText && pageSection.lainLainText.trim().length > 0)
      
      // Skip this page if it has no meaningful data
      if (!hasMeaningfulData) continue;
      
      out.push({
        standardCode: std,
        pageCode: page.code,
        title: page.title,
        plan: page.plan ?? [],
        doText: pageSection.doText ?? '',
        actText: pageSection.actText ?? '',
        checklistLabels: page.check?.checkboxes ?? [],
        checklistChecked: ev.slice(0, checkLen),
        evidenceLabels: page.evidenceLabels ?? [],
        evidenceChecked: ev.slice(0, evidenceLen),
        score: pageSection.score ?? null,
        remarks: pageSection.remarks ?? '',
        lainLainText: pageSection.lainLainText ?? ''
      })
    }
  }
  
  return out
}


