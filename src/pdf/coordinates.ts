// Coordinates mapping for official borang templates (placeholder positions)
// Update these after measuring exact x,y for each field on each PDF.

// Coordinates are measured roughly for A4 @ 72dpi; tune as needed.
export const headerCoords = {
  schoolName: { x: 65, y: 740 },
  visitDate: { x: 420, y: 740 },
};

export type SectionMap = {
  score?: { x: number; y: number }
  evidences?: Array<{ x: number; y: number }>
  remarks?: { x: number; y: number; maxWidth: number; lineHeight: number }
};

export const sectionCoords: Record<string, SectionMap> = {
  '1': {
    score: { x: 560, y: 612 },
    evidences: [
      { x: 40, y: 360 }, // SWOT
      { x: 40, y: 342 }, // Buku Pengurusan Sekolah
      { x: 40, y: 324 }, // Minit Mesyuarat Pengurusan dan Pentadbiran
      { x: 40, y: 306 }, // Minit Mesyuarat Guru
      { x: 40, y: 288 }, // Minit Mesyuarat Pengurusan Kurikulum/Kokurikulum/HEM
      { x: 40, y: 270 }, // Visi, Misi - Papan Kenyataan...
      { x: 460, y: 360 }, // Laporan Guru Bertugas Mingguan
      { x: 460, y: 342 }, // Catatan Perhimpunan Sekolah
      { x: 460, y: 324 }, // Papan Kenyataan Pengurusan Sekolah
      { x: 460, y: 306 }, // Facebook Rasmi Sekolah
      { x: 460, y: 288 }, // Lain-lain
    ],
    remarks: { x: 60, y: 250, maxWidth: 500, lineHeight: 12 },
  },
  '2': { score: { x: 560, y: 612 }, evidences: [], remarks: { x: 60, y: 250, maxWidth: 500, lineHeight: 12 } },
  '3.1': { score: { x: 560, y: 612 }, evidences: [], remarks: { x: 60, y: 250, maxWidth: 500, lineHeight: 12 } },
  '3.2': { score: { x: 560, y: 612 }, evidences: [], remarks: { x: 60, y: 250, maxWidth: 500, lineHeight: 12 } },
  '3.3': { score: { x: 560, y: 612 }, evidences: [], remarks: { x: 60, y: 250, maxWidth: 500, lineHeight: 12 } },
};

export const templatePaths = {
  '1': '/standard 1/1-2.pdf',
  '2': '/standard 2/2-2.pdf',
  '3.1': '/standard 3.1/3.1-2.pdf',
  '3.2': '/standard 3.2/3.2-2.pdf',
  '3.3': '/standard 3.3/3.3-2.pdf',
};

// Page catalogs per standard for multi-form navigation
export const standardPages: Record<string, string[]> = {
  '1': ['1-2','1-3','1-4','1-5','1-6','1-7','1-8','1-9','1-10','1-11','1-12','1-13'],
  '2': ['2-2','2-3','2-4','2-5','2-6','2-7','2-8','2-9','2-10'],
  '3.1': ['3.1-2','3.1-3','3.1-4','3.1-5','3.1-6','3.1-7','3.1-8'],
  '3.2': ['3.2-2','3.2-3','3.2-4','3.2-5','3.2-6','3.2-7','3.2-8'],
  '3.3': ['3.3-2','3.3-3','3.3-4','3.3-5','3.3-6','3.3-7','3.3-8'],
};

export function pageToPath(code: string) {
  const [std] = code.split('-');
  const base = std.includes('3.1') ? '/standard 3.1' : std.includes('3.2') ? '/standard 3.2' : std.includes('3.3') ? '/standard 3.3' : std.startsWith('2') ? '/standard 2' : '/standard 1';
  return `${base}/${code}.pdf`;
}


