import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { standardsConfig } from '@/standards/config'

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

export async function generateVisitReportPdf(data: ReportExport): Promise<Blob> {
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

  // Sections
  for (const s of data.sections) {
    // Only output if there is any content
    const anySelected = (arr?: boolean[]) => (arr ?? []).some(Boolean)
    const hasDo = !!(s.doText && s.doText.trim())
    const hasAct = !!(s.actText && s.actText.trim())
    const hasChecklistSelected = anySelected(s.checklistChecked)
    const hasEvidenceSelected = anySelected(s.evidenceChecked)
    const hasScore = typeof s.score === 'number'
    
    // Only show sections that have actual user input (not just default PLAN content)
    if (!(hasDo || hasAct || hasChecklistSelected || hasEvidenceSelected || hasScore)) {
      continue
    }
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
    if (hasDo) {
      ensureRoom()
      draw('DO:', { bold: true })
      drawWrapped(s.doText!)
      y -= 8 // Add space after DO
    } else if (s.doText !== undefined) {
      // Show DO section even if empty, but only if it was explicitly set
      ensureRoom()
      draw('DO:', { bold: true })
      drawWrapped(s.doText || 'No implementation details provided')
      y -= 8 // Add space after DO
    }

    // CHECK
    if (s.checklistLabels && s.checklistLabels.length > 0) {
      ensureRoom()
      draw('CHECK:', { bold: true })
      s.checklistLabels.forEach((label, idx) => {
        const checked = s.checklistChecked[idx] || false
        drawWrapped(`${checked ? '[x]' : '[ ]'} ${label}`)
      })
      y -= 8 // Add space after CHECK
    }

    // EVIDENCE (selected only)
    const selectedEvidence = s.evidenceLabels.filter((_, idx) => s.evidenceChecked[idx])
    if (selectedEvidence.length > 0) {
      ensureRoom()
      draw('EVIDENCE:', { bold: true })
      selectedEvidence.forEach((label) => drawWrapped(`• ${label}`))
      y -= 8 // Add space after EVIDENCE
    }

    // ACT
    if (hasAct) {
      ensureRoom()
      draw('ACT:', { bold: true })
      drawWrapped(s.actText!)
      y -= 8 // Add space after ACT
    }

    // IMAGES for this section
    const sectionImages = (data.images || []).filter(img => img.section_code === s.standardCode);
    if (sectionImages.length > 0) {
      ensureRoom(50)
      draw('IMAGES:', { bold: true })
      sectionImages.forEach((img, idx) => {
        const description = img.description || img.original_name;
        drawWrapped(`• ${description}`, { bullet: undefined });
        if (idx < sectionImages.length - 1) y -= 2; // Less space between image items
      });
      y -= 8 // Add space after IMAGES
    }
    
    // Add more space between sections
    y -= 20
  }

  const bytes = await doc.save()
  return new Blob([bytes], { type: 'application/pdf' })
}

// Helper to build SectionInput rows for current in-memory state (used by VisitForm)
export function buildReportSectionsFromState(localSections: any, pageIndex: Record<string, number>) {
  const out: SectionInput[] = []
  for (const std of Object.keys(pageIndex)) {
    const stdCfg = standardsConfig[std]
    const code = std as '1'|'2'|'3.1'|'3.2'|'3.3'
    const page = stdCfg.pages[pageIndex[std] ?? 0]
    if (!page) continue
    const ev = (localSections[std]?.evidences ?? []) as boolean[]
    const checkLen = page.check?.checkboxes?.length ?? 0
    const evidenceLen = page.evidenceLabels?.length ?? 0
    out.push({
      standardCode: code,
      pageCode: page.code,
      title: page.title,
      plan: page.plan ?? [],
      doText: localSections[std]?.doText ?? '',
      actText: localSections[std]?.actText ?? '',
      checklistLabels: page.check?.checkboxes ?? [],
      checklistChecked: ev.slice(0, checkLen),
      evidenceLabels: page.evidenceLabels ?? [],
      evidenceChecked: ev.slice(0, evidenceLen),
      score: localSections[std]?.score ?? null,
    })
  }
  return out
}


