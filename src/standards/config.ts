export type PageSchema = {
  code: string // e.g., '1-2'
  title: string // e.g., '1.1.1 ...'
  evidenceLabels: string[] // including "Lain-lain" for input field
  plan: string[] // Information list for PLAN section
  do: {
    text: string // User input text
    suggestions: string[] // Common answer suggestions for dropdown
  }
  check: {
    criteria: string[] // The actual descriptive criteria text (left side)
    checkboxes: string[] // Checkbox options for assessment (right side)
  }
  act: {
    text: string // User input text
    suggestions: string[] // Common answer suggestions for dropdown
  }
}

export type StandardConfig = {
  standardCode: '1'|'2'|'3.1'|'3.2'|'3.3'
  pages: PageSchema[]
}

// Helpers to generate generic labels
const ev = (n: number) => Array.from({ length: n }, (_, i) => `Evidence ${i+1}`)

// NOTE: Titles are approximations based on common numbering. Adjust as needed.
export const standardsConfig: Record<string, StandardConfig> = {
  '1': {
    standardCode: '1',
    pages: [
      {
        code: '1-2',
        title: 'ASPEK 1.1: PGB SEBAGAI PENERAJU 1.1.1 PGB menetapkan hala tuju sekolah secara terancang',
        evidenceLabels: [
          'Analisis SWOT',
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Pengurusan dan Pentadbiran',
          'Minit Mesyuarat Guru',
          'Minit Mesyuarat Pengurusan Kurikulum/Kokurikulum/HEM',
          'Visi, Misi - Papan Kenyataan Sekolah / Persekitaran Sekolah: Banner/Bunting/Mural/Poster',
          'Laporan Guru Bertugas Mingguan',
          'Catatan Perhimpunan Sekolah',
          'Papan Kenyataan Pengurusan Sekolah',
          'Facebook Rasmi Sekolah',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Membuat analisis SWOT/ analisis lain yang bersesuaian b) Menentukan KPI c) Mendokumen hala tuju d) Menyebarluas hala tuju',
        ],
        do: {
          text: '',
          suggestions: [
            'Secara menyeluruh meliputi bidang kurikulum, kokurikulum, HEM, kewangan, sumber manusia, prasarana dan sumber pendidikan',
            'Mengikut keperluan sekolah mengambil kira latar belakang murid, sumber, prasarana sekolah dan perkembangan pendidikan semasa',
            'Secara jelas'
          ]
        },
        check: {
          criteria: [
            'Secara menyeluruh meliputi bidang kurikulum, kokurikulum, HEM, kewangan, sumber manusia, prasarana dan sumber pendidikan',
            'Mengikut keperluan sekolah mengambil kira latar belakang murid, sumber, prasarana sekolah dan perkembangan pendidikan semasa',
            'Secara jelas'
          ],
          checkboxes: [
            'Semua',
            '1&2@1&3',
            '1',
            '2@3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-3',
        title: 'ASPEK 1.1: PGB SEBAGAI PENERAJU 1.1.2 PGB mengetuai penyediaan Rancangan Pemajuan Sekolah secara terancang dan sistematik',
        evidenceLabels: [
          'Minit Mesyuarat Jawatankuasa Perancangan dan Kemajuan Sekolah',
          'Taklimat Garis Panduan Penyediaan Perancangan Strategik',
          'Dokumen Perancangan Strategik / PSO',
          'Pelan Intervensi Transformasi Sekolah (PInTaS)',
          'OPPM',
          'Minit Mesyuarat Pengurusan dan Pentadbiran',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Menyediakan garis panduan/ format PSO b) Merangka strategi pencapaian sasaran c) Memantau penyediaan PSO d) Menyiapkan dokumen PSO',
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut ketetapan sekolah',
            'Secara menyeluruh – kurikulum, kokurikulum, HEM, kewangan, sumber manusia, prasarana sekolah dan sumber pendidikan',
            'Dengan mekanisme yang sesuai'
          ]
        },
        check: {
          criteria: [
            'Mengikut ketetapan sekolah',
            'Secara menyeluruh – kurikulum, kokurikulum, HEM, kewangan, sumber manusia, prasarana sekolah dan sumber pendidikan',
            'Dengan mekanisme yang sesuai'
          ],
          checkboxes: [
            'Semua',
            '1&2@1&3',
            '1',
            '2@3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-4',
        title: 'ASPEK 1.1: PGB SEBAGAI PENERAJU 1.1.3 PGB mengetuai pemantauan pengoperasian sekolah secara terancang dan sistematik',
        evidenceLabels: [
          'Buku Catatan Pemantauan Pengetua',
          'Minit Mesyuarat Pengurusan dan Pentadbiran',
          'Rekod Pencerapan Pdpc (Std 4)',
          'Laporan Guru Bertugas Mingguan',
          'Laporan Learning Walks',
          'Maklum Balas Tindakan',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Menyediakan format pemantauan b) Merangka jadual pemantauan c) Memantau pengoperasian sekolah d) Mengambil tindakan susulan',
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut jadual yang ditetapkan',
            'Secara menyeluruh meliputi semua aspek pengoperasian sekolah',
            'Dengan mekanisme yang sesuai'
          ]
        },
        check: {
          criteria: [
            'Mengikut jadual yang ditetapkan',
            'Secara menyeluruh meliputi semua aspek pengoperasian sekolah',
            'Dengan mekanisme yang sesuai'
          ],
          checkboxes: [
            'Semua',
            '1&2@1&3',
            '1',
            '2@3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-5',
        title: 'ASPEK 1.1: PGB SEBAGAI PENERAJU 1.1.4 PGB menerajui aktiviti instruksional dalam pelaksanaan PdP secara professional dan terancang',
        evidenceLabels: [
          'Jadual Waktu Induk',
          'Jadual Waktu Pengetua',
          'e - RPH / BRM Pengetua',
          'Rekod Pentaksiran Bilik Darjah',
          'Analisis Peperiksaan / Pentaksiran',
          'Laporan Semakan Hasil Kerja Murid',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Menyediakan RPH b) Melaksanakan PdP c) Melaksanakan peperiksaan/ pentaksiran terhadap penguasaan murid d) Menyemak hasil kerja murid',
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut arahan yang berkuatkuasa',
            'Mematuhi jadual',
            'Secara tekal',
            'Secara menyeluruh kepada semua perkara/murid'
          ]
        },
        check: {
          criteria: [
            'Mengikut arahan yang berkuatkuasa',
            'Mematuhi jadual',
            'Secara tekal',
            'Secara menyeluruh kepada semua perkara/murid'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-6',
        title: 'ASPEK 1.1: PGB SEBAGAI PENERAJU 1.1.5 PGB menerajui aktiviti instruksional dalam pencerapan PdP secara professional dan terancang',
        evidenceLabels: [
          'Takwim Pencerapan (Buku Pengurusan Sekolah)',
          'Catatan Sesi Instruksional Coaching',
          'Borang Pencerapan Std 4',
          'Skor Pencerapan Std 4',
          'Maklum Balas Pencerapan',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Melaksanakan pencerapan PdP b) Memberi maklum balas dan bimbingan c) Mengambil tindakan susulan',
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut ketetapan sekolah',
            'Secara menyeluruh kepada semua guru',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mengikut ketetapan sekolah',
            'Secara menyeluruh kepada semua guru',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua 3',
            '1 & 2 @1&3',
            '1',
            '2 @3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-7',
        title: 'ASPEK 1.1: PGB SEBAGAI PENERAJU 1.1.6 PGB menerajui aktiviti instruksional dalam pelaksanaan pemantauan kemajuan dan pencapaian murid secara sistematik dan terancang',
        evidenceLabels: [
          'Data Pencapaian Murid (Kurikulum/Kokurikulum/HEM)',
          'Analisis Pencapaian Murid',
          'Maklum Balas Dialog Prestasi Kurikulum/Kokurikulum/HEM',
          'Laporan Program Intervensi',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Menganalisis pencapaian murid b) Menyediakan rumusan kemajuan dan pencapaian murid c) Mengadakan dialog prestasi d) Mengambil tindakan susulan',
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut ketetapan sekolah',
            'Secara menyeluruh – bidang kurikulum, kokurikulum dan HEM',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mengikut ketetapan sekolah',
            'Secara menyeluruh – bidang kurikulum, kokurikulum dan HEM',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua 3',
            '1 & 2 @1&3',
            '1',
            '2 @3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-8',
        title: 'ASPEK 1.1: PGB SEBAGAI PENERAJU 1.1.7 PGB menangani masalah pengoperasian sekolah secara profesional dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat Pengurusan dan Pentadbiran',
          'Laporan Guru Bertugas Mingguan',
          'Laporan LW/Suara Guru/Suara Murid/Media Sosial',
          'Laporan EMIS/Aset',
          'Laporan Keselamatan Sekolah (PKK)/Laporan Audit/Laporan Warden',
          'Minit Mesyuarat Kurukulum/Kokurikulum/HEM',
          'Kertas Kerja Program/Intervensi',
          'Laporan Program/Intervensi',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Mengesan jangkaan masalah/ isu b) Mengenal pasti punca dan mengambil tindakan terhadap masalah/ isu c) Menyelesaikan masalah/ isu d) Mengambil langkah kawalan/ tindakan pencegahan bagi mengelak masalah/ isu berulang',
        ],
        do: {
          text: '',
          suggestions: [
            'Dengan mekanisme yang sesuai',
            'Secara telus',
            'Mengikut kesesuaian'
          ]
        },
        check: {
          criteria: [
            'Dengan mekanisme yang sesuai',
            'Secara telus',
            'Mengikut kesesuaian'
          ],
          checkboxes: [
            'Semua 3',
            '1 & 2 @1&3',
            '1',
            '2 @3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-9',
        title: 'ASPEK 1.2: PGB SEBAGAI PEMBIMBING 1.2.1 PGB memberi bimbingan kepada guru dan AKP secara profesional dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat Pengurusan Kakitangan Sokongan',
          'Laporan/Taklimat/Bengkel/Kursus/Ceramah',
          'Bahan Pembentangan',
          'Penilaian Prestasi Bersepadu/LNPT',
          'Catatan Sesi Coaching dan Mentoring',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Memberi taklimat/ bengkel/ kursus/ ceramah b) Memberi panduan/ tunjuk ajar/ tunjuk cara/ nasihat/ penerangan c) Memberi maklum balas berkaitan prestasi kerja',
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut perkembangan semasa/ kesesuaian',
            'Secara jelas/berhemah',
            'Secara menyeluruh kepada semua guru dan AKP',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mengikut perkembangan semasa/ kesesuaian',
            'Secara jelas/berhemah',
            'Secara menyeluruh kepada semua guru dan AKP',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-10',
        title: 'ASPEK 1.2: PGB SEBAGAI PEMBIMBING 1.2.2 PGB memberi bimbingan kepada barisan pemimpin yang diturunkan kuasa secara profesional dan terancang',
        evidenceLabels: [
          'Catatan Sesi Coaching & Mentoring',
          'Taklimat / Bimbingan / Kursus',
          'Maklum balas Pemantauan',
          'Laporan Sesi Konsultasi Keberhasilan',
          'Minit Mesyuarat Pengurusan',
          'Buku Catatan Harian PGB',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Memberi panduan/ tunjuk ajar/ tunjuk cara/ nasihat/ penerangan b) Memberi maklum balas berkaitan prestasi kerja c) Memberi pendedahan berkaitan tugas kepimpinan',
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut kesesuaian',
            'Secara jelas/ berhemah',
            'Secara menyeluruh dalam semua bidang tugas',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mengikut kesesuaian',
            'Secara jelas/ berhemah',
            'Secara menyeluruh dalam semua bidang tugas',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-11',
        title: 'ASPEK 1.3: PGB SEBAGAI PENDORONG 1.3.1 PGB mendorong warga sekolah dengan menjadi suri teladan secara profesional dan terancang',
        evidenceLabels: [
          'Rekod Kehadiran Pengetua',
          'e - RPH / BRM Pengetua',
          'Taklimat Pengetua',
          'Penampilan Diri',
          'Komunikasi',
          'Maklum balas Warga Sekolah / Suara Guru',
          'Laporan SPLKPM (Pelibatan PGB)',
          'Anugerah / Pencapaian / Pengiktirafan',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Melaksanakan tugas berkualiti b) Mempamerkan penampilan diri berwibawa c) Bertindak sebagai pakar rujuk d) Memperlihatkan komunikasi yang berkesan',
        ],
        do: {
          text: '',
          suggestions: [
            'Secara tekal',
            'Dengan bertanggungjawab/ beretika/ berhemah',
            'Secara menyeluruh dalam semua bidang tugas / situasi'
          ]
        },
        check: {
          criteria: [
            'Secara tekal',
            'Dengan bertanggungjawab/ beretika/ berhemah',
            'Secara menyeluruh dalam semua bidang tugas / situasi'
          ],
          checkboxes: [
            'Semua 3',
            '1 & 2 @1&3',
            '1',
            '2 @3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-12',
        title: 'ASPEK 1.3: PGB SEBAGAI PENDORONG 1.3.2 PGB menggalakkan warga sekolah memberi input berkaitan pemajuan sekolah secara profesional dan terancang',
        evidenceLabels: [
          'Media Sosial Rasmi Sekolah',
          'Minit Mesyuarat Guru',
          'Minit Mesyuarat Pengurusan Kakitangan Sokongan',
          'Catatan Sesi Coaching & Mentoring Pengetua',
          'Minit Mesyuarat Pengurusan Kakitangan Sokongan',
          'Peti Cadangan',
          'Usul dan Cadangan Minit Mesyuarat Agung PIBG',
          'Suara Guru / Suara Murid / Suara Ibu Bapa',
          'Catatan/Laporan Maklum balas Tindakan',
          'Laporan Kelab Guru dan Staf',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Menyediakan saluran untuk berkomunikasi b) Mendengar pandangan daripada pelbagai pihak c) Menerima pandangan/ maklum balas yang berbeza d) Mengambil tindakan terhadap pandangan/ maklum balas',
        ],
        do: {
          text: '',
          suggestions: [
            'a.Secara fleksibel/ terbuka',
            'b. Secara berfokus kepada hala tuju sekolah',
            'Secara tekal',
            'Secara berfokus / mengikut keperluan/ kesesuaian'
          ]
        },
        check: {
          criteria: [
            'a.Secara fleksibel/ terbuka',
            'b. Secara berfokus kepada hala tuju sekolah',
            'Secara tekal',
            'Secara berfokus / mengikut keperluan/ kesesuaian'
          ],
          checkboxes: [
            'Semua 3',
            '1 & 2 @1&3',
            '1',
            '2 @3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '1-13',
        title: 'ASPEK 1.3: PGB SEBAGAI PENDORONG 1.3.3 PGB menggerakkan warga sekolah dalam melaksanakan tanggungjawab secara terancang',
        evidenceLabels: [
          'Media sosial - Ucapan Terima Kasih & Tahniah',
          'Hari Anugerah/Majlis Sambutan/Majlis Pentauliahan',
          'OPR Naik Taraf / Penyelenggaraan',
          'Album Sekolah / Brosur',
          'Laporan Program / Laporan Guru Bertugas',
          'Laporan Kerosakan',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Memberi maklum balas positif berkaitan prestasi/ kemajuan/ pencapaian kerja b) Memberi penghargaan/ pengiktirafan c) Menyediakan keperluan dan kemudahan d) Melibatkan diri dalam aktiviti sekolah',
        ],
        do: {
          text: '',
          suggestions: [
            'a. Dari semasa ke semasa',
            'b. Secara tekal',
            'a.Secara menyeluruh – kurikulum, kokurikulum, HEM, kewangan, sumber manusia, prasarana sekolah dan sumber pendidikan',
            'b. Secara menyeluruh kepada semua warga sekolah',
            'Mengikut kesesuaian'
          ]
        },
        check: {
          criteria: [
            'a. Dari semasa ke semasa',
            'b. Secara tekal',
            'a.Secara menyeluruh – kurikulum, kokurikulum, HEM, kewangan, sumber manusia, prasarana sekolah dan sumber pendidikan',
            'b. Secara menyeluruh kepada semua warga sekolah',
            'Mengikut kesesuaian'
          ],
          checkboxes: [
            'Semua 3',
            '1 & 2 @1&3',
            '1',
            '2 @3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
    ],
  },
  '2': {
    standardCode: '2',
    pages: [
      {
        code: '2-2',
        title: 'ASPEK 2.1: PENGURUSAN SUMBER MANUSIA 2.1.1 Sumber manusia diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Buku Panduan MySG KPM',
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Pengurusan Kurikulum /HEM/ Kokurikulum',
          'Minit Mesyuarat Guru',
          'Minit Mesyuarat Pengurusan Kakitangan Sokongan',
          'Rekod Keberhasilan dan Penilaian Prestasi',
          'Rekod Fail Perkhidmatan',
          'Lain - lain',
        ],
        plan: [
          'Membimbing PGB: a) Mengagihkan tugas b) Menyediakan perincian tugas c) Menyebarluaskan perincian tugas d) Menilai prestasi kerja e) Melaksanakan urusan perkhidmatan (SPP/ ePROPER)'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan/ prosedur',
            'Mengikut kesesuaian',
            'Secara menyeluruh dalam semua bidang',
            'Secara jelas'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan/ prosedur',
            'Mengikut kesesuaian',
            'Secara menyeluruh dalam semua bidang',
            'Secara jelas'
          ],
          checkboxes: [
            'Semua',
            '1 & 2 @1&3',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
             {
         code: '2-3',
         title: 'ASPEK 2.1: PENGURUSAN SUMBER MANUSIA 2.1.2 Pembangunan sumber manusia diurus secara terancang',
         evidenceLabels: [
           'Buku Pengurusan Sekolah',
           'Analisis Keperluan Latihan (TNA) SPL KPM',
           'Kertas Kerja Program Pembangunan Sumber Manusia',
           'Laporan Program Pembangunan Sumber Manusia',
           'Borang Maklumbalas Program Pembangunan Sumber Manusia',
           'PInTaS dan OPPM aktiviti pembangunan sumber manusia',
           'Pelaporan LDP dan Mata Kredit SPL KPM',
           'Takwim CPD / PLC / CM',
           'Rekod CPD / PLC / CM',
           'Lain - lain',
         ],
         plan: [
           'Membimbing PGB: a) Merancang dan melaksanakan program pembangunan profesionalisme b) Menilai keberkesanan program c) Mengambil tindakan susulan'
         ],
         do: {
          text: '',
          suggestions: [
            'Mengikut kesesuaian',
            'Mengambil kira perkembangan pendidikan/ perkhidmatan semasa',
            'Secara menyeluruh kepada setiap guru dan AKP',
            'Dari semasa ke semasa'
          ]
        },
         check: {
           criteria: [
             'Mengikut kesesuaian',
             'Mengambil kira perkembangan pendidikan/ perkhidmatan semasa',
             'Secara menyeluruh kepada setiap guru dan AKP',
             'Dari semasa ke semasa'
           ],
           checkboxes: [
             'Semua',
             '1 & mana-mana dua perkara',
             '1 & mana-mana satu perkara',
             '1 sahaja',
             'Tiada'
           ]
         },
         act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
       },
       {
         code: '2-4',
         title: 'ASPEK 2.2: PENGURUSAN ASET 2.2.1 Aset alih dan aset tak alih diurus secara sistematik dan terancang',
         evidenceLabels: [
           'Minit Mesyuarat JKPAK',
           'Surat Lantikan Pegawai Aset',
           'Buku Rekod Penggunaan Peralatan ICT',
           'Buku Laporan Penggunaan LCD / Makmal',
           'Laporan Aset Tahunan ( Kew PA 3, Kew PA 4, Kew PA 5, Kew PA8, Kew PA 14, Kew PA 18, Kew PA 20)',
           'Laporan EMIS',
           'Lain - lain',
         ],
         plan: [
           'Membimbing PGB: a) Menyediakan harta modal dan aset alih bernilai rendah b) Menggunakan harta modal, aset alih bernilai rendah dan infrastruktur c) Menyelenggara harta modal dan infrastruktur d) Mengambil tindakan terhadap hasil pemeriksaan harta modal, aset alih bernilai rendah dan infrastruktur e) Merekod perolehan, penggunaan dan selenggara'
         ],
         do: {
          text: '',
          suggestions: [
            'Mengikut prosedur yang ditetapkan',
            'Mengikut kesesuaian',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ]
        },
         check: {
           criteria: [
             'Mengikut prosedur yang ditetapkan',
             'Mengikut kesesuaian',
             'Secara menyeluruh',
             'Dari semasa ke semasa'
           ],
           checkboxes: [
             'Semua',
             '1 & mana-mana dua perkara',
             '1 & mana-mana satu perkara',
             '1 sahaja',
             'Tiada'
           ]
         },
         act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
       },
       {
         code: '2-5',
         title: 'ASPEK 2.3: PENGURUSAN KEWANGAN 2.3.1 Kewangan diurus secara sistematik dan terancang',
         evidenceLabels: [
           'Minit Mesyuarat JK Kewangan',
           'Laporan Perbelanjaan (KWK, SUWA, dan Asrama)',
           'Baucar Bayaran dan Dokumen Sokongan',
           'Laporan pemantauan kewangan',
           'Penyata kewangan bulanan eSPKWS',
           'Dapatan laporan audit tahunan / maklumbalas',
           'Buku pemeriksaan mengejut kewangan',
           'Laporan Anggaran Belanja Mengurus (ABM)',
           'Lain - lain',
         ],
         plan: [
           'Membimbing PGB: a) Menyediakan anggaran perbelanjaan b) Melaksanakan perbelanjaan c) Melaksanakan pemantauan perbelanjaan d) Mengambil tindakan susulan'
         ],
         do: {
          text: '',
          suggestions: [
            'Mematuhi ketetapan dan prosedur yang berkuatkuasa',
            'Mengikut kesesuaian',
            'Secara menyeluruh dalam setiap bidang'
          ]
        },
         check: {
           criteria: [
             'Mematuhi ketetapan dan prosedur yang berkuatkuasa',
             'Mengikut kesesuaian',
             'Secara menyeluruh dalam setiap bidang'
           ],
           checkboxes: [
             'Semua',
             '1 & 2 @1&3',
             '1',
             '2 @3',
             'Tiada'
           ]
         },
         act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
       },
       {
         code: '2-6',
         title: 'ASPEK 2.4: PENGURUSAN SUMBER PENDIDIKAN 2.4.1 Sumber pendidikan diurus secara sistematik dan terancang',
         evidenceLabels: [
           'Minit Mesyuarat JK PSS',
           'Rekod Penerimaan Bahan Buku & Bukan Buku',
           'Rekod Pengurusan Bahan Buku & Bukan Buku',
           'Rekod Penggunaan Makmal / Pusat Akses',
           'Laporan Penyelenggaraan Pusat Akses',
           'Kertas kerja aktiviti PSS',
           'Laporan Aset Tahunan',
           'Lain - lain',
         ],
         plan: [
           'Membimbing PGB: a) Menyediakan alat/ bahan, bahan cetak/ elektronik dan TMK b) Menyimpan dan menyusun atur alat/ bahan, bahan cetak/ elektronik dan TMK c) Menggunakan alat/ bahan, bahan cetak/ elektronik dan TMK d) Melaksanakan penyeliaan penggunaan alat/ bahan, bahan cetak/ elektronik dan TMK'
         ],
         do: {
          text: '',
          suggestions: [
            'Mengikut ketetapan',
            'Berdasarkan kesesuaian',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ]
        },
         check: {
           criteria: [
             'Mengikut ketetapan',
             'Berdasarkan kesesuaian',
             'Secara menyeluruh',
             'Dari semasa ke semasa'
           ],
           checkboxes: [
             'Semua',
             '1 & mana-mana dua perkara',
             '1 & mana-mana satu perkara',
             '1 sahaja',
             'Tiada'
           ]
         },
         act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
       },
       {
         code: '2-7',
         title: 'ASPEK 2.5: IKLIM 2.5.1 Persekitaran fizikal diselenggara secara sistematik dan terancang',
         evidenceLabels: [
           'Buku Laporan Guru Bertugas Mingguan',
           'Laporan Program Gotong - Royong MADANI',
           'Laporan Projek Naik Taraf Asrama',
           'Laporan Projek Naik Taraf Bilik Guru / Bilik Khas',
           'Laporan Keceriaan Kelas PAK21',
           'Laporan Baikpulih Tandas',
           'Laporan kerja bulanan KBK',
           'Pelan Kebakaran Sekolah / Pelan Tindakan Kecemasan',
           'Lain - lain',
         ],
         plan: [
           'Membimbing PGB: a) Membersih, menceria dan memulihkan bangunan dan kemudahan sekolah b) Mewujudkan ciri - ciri keselamatan'
         ],
         do: {
          text: '',
          suggestions: [
            'Mengikut ketetapan',
            'Dengan mematuhi prosedur',
            'Dengan mekanisme yang sesuai',
            'Dari semasa ke semasa'
          ]
        },
         check: {
           criteria: [
             'Mengikut ketetapan',
             'Dengan mematuhi prosedur',
             'Dengan mekanisme yang sesuai',
             'Dari semasa ke semasa'
           ],
           checkboxes: [
             'Semua',
             '1 & mana-mana dua perkara',
             '1 & mana-mana satu perkara',
             '1 sahaja',
             'Tiada'
           ]
         },
         act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
       },
       {
         code: '2-8',
         title: 'ASPEK 2.5: IKLIM 2.5.2 Suasana yang selesa dan harmoni diwujud dan dikekalkan secara sistematik dan terancang',
         evidenceLabels: [
           'Buku Tatacara Pengendalian Disiplin',
           'Buku Peraturan Sekolah / Asrama',
           'Buku Laporan Bertugas Mingguan',
           'Kertas Kerja Program Gotong Royong MADANI',
           'Kertas Kerja Sambutan Hari Perayaan / Kebesaran / Patriotik',
           'Laporan Program Gotong Royong MADANI',
           'Laporan Sambutan Hari Perayaan / Kebesaran / Patriotik',
           'Pelaksanaan Pembudayaan ETOS sekolah',
           'Papan Tanda / Banner / Bunting / Mural',
           'Lain - lain',
         ],
         plan: [
           'Membimbing PGB: a) Menguatkuasakan ketetapan/ peraturan sekolah b) Merancang program peningkatan keakraban/ semangat kesepunyaan c) Melaksanakan program peningkatan keakraban/ semangat kesepunyaan'
         ],
         do: {
          text: '',
          suggestions: [
            'Mematuhi prosedur yang ditetapkan',
            'Secara menyeluruh kepada semua warga sekolah',
            'Dengan mekanisme yang sesuai',
            'Dari semasa ke semasa'
          ]
        },
         check: {
           criteria: [
             'Mematuhi prosedur yang ditetapkan',
             'Secara menyeluruh kepada semua warga sekolah',
             'Dengan mekanisme yang sesuai',
             'Dari semasa ke semasa'
           ],
           checkboxes: [
             'Semua',
             '1 & mana-mana dua perkara',
             '1 & mana-mana satu perkara',
             '1 sahaja',
             'Tiada'
           ]
         },
         act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
       },
       {
         code: '2-9',
         title: 'ASPEK 2.6: PENGURUSAN PERPADUAN 2.6.1 Pemahaman dan penerimaan terhadap kepelbagaian masyarakat Malaysia diurus secara terancang',
         evidenceLabels: [
           'Poster / Banner Kepelbagaian Masyarakat Malaysia',
           'Kertas Kerja Program Sambutan Hari Kebangsaan / Hari Malaysia',
           'Laporan Program Sambutan Hari Kebangsaan / Hari Malaysia',
           'Laporan Program Jaringan/Jalinan',
           'Laporan aktiviti Bulan Perpaduan',
           'Laporan RIMUP',
           'Lain - lain',
         ],
         plan: [
           'Membimbing PGB: a) Menyebarkan maklumat kepelbagaian masyarakat Malaysia b) Merancang dan melaksanakan program berteraskan perpaduan/ silang budaya c) Merancang dan melaksanakan program jaringan/ jalinan berteraskan perpaduan/ silang budaya'
         ],
         do: {
          text: '',
          suggestions: [
            'Mengikut kesesuaian sekolah',
            'Dengan mekanisme yang sesuai',
            'Secara menyeluruh kepada semua warga sekolah',
            'Dari semasa ke semasa'
          ]
        },
         check: {
           criteria: [
             'Mengikut kesesuaian sekolah',
             'Dengan mekanisme yang sesuai',
             'Secara menyeluruh kepada semua warga sekolah',
             'Dari semasa ke semasa'
           ],
           checkboxes: [
             'Semua',
             '1 & mana-mana dua perkara',
             '1 & mana-mana satu perkara',
             '1 sahaja',
             'Tiada'
           ]
         },
         act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
       },
       {
         code: '2-10',
         title: 'ASPEK 2.7: PERMUAFAKATAN STRATEGIK 2.7.1 Pemahaman dan penerimaan terhadap kepelbagaian masyarakat Malaysia diurus secara terancang',
         evidenceLabels: [
           'Perancangan Strategik /PInTaS /OPPM',
           'OPR Majlis Perlantikan Pemimpin Pelajar & Pelancaran NILAM',
           'OPR Mesyuarat Agung PIBG/Hari Anugerah Cemerlang/Bantuan Awal Persekolahan',
           'Surat Permohonan Sumbangan & Sijil Penghargaan',
           'Facebook Rasmi Sekolah',
           'Laporan aktiviti PIBKS',
           'Minit Mesyuarat PIBG',
           'Lain - lain',
         ],
         plan: [
           'Membimbing PGB: a) Merancang dan melaksanakan program yang melibatkan ibu bapa, komuniti dan pihak swasta b) Mendapatkan sumbangan/ sokongan/ khidmat kepakaran c) Mewujudkan rangkaian komuniti'
         ],
         do: {
          text: '',
          suggestions: [
            'Mengikut keperluan',
            'Secara kreatif dan inovatif',
            'Dengan mekanisme yang sesuai (penubuhan JK/ melalui media sosial/ akses dalam talian)',
            'Dari semasa ke semasa'
          ]
        },
         check: {
           criteria: [
             'Mengikut keperluan',
             'Secara kreatif dan inovatif',
             'Dengan mekanisme yang sesuai (penubuhan JK/ melalui media sosial/ akses dalam talian)',
             'Dari semasa ke semasa'
           ],
           checkboxes: [
             'Semua',
             '1 & mana-mana dua perkara',
             '1 & mana-mana satu perkara',
             '1 sahaja',
             'Tiada'
           ]
         },
         act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
       },

    ],
  },
  '3.1': {
    standardCode: '3.1',
    pages: [
      {
        code: '3.1-2',
        title: 'ASPEK 3.1.1: KETETAPAN PELAKSANAAN KURIKULUM 3.1.1.1 Pelaksanaan kurikulum diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Pelan Strategik /PInTaS/OPPM Kurikulum',
          'Profil Akademik Sekolah',
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Pengurusan Kurikulum',
          'Jadual Waktu Persekolahan',
          'Takwim Peperiksaan dan Pentaksiran',
          'Papan Kenyataan Unit Kurikulum',
          'Laporan Dialog Prestasi Kurikulum',
          'Pamplet/Media sosial',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Membuat ketetapan b) Mendokumenkan ketetapan c) Menyebarluaskan ketetapan d) Menyemak semula ketetapan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa',
            'Menyeluruh - penubuhan panitia MP, peruntukan kewangan, pentaksiran, penjaminan kualiti (4P), latihan/ tugasan, pembelajaran digital, PdPR/ remote learning, sumber pendidikan dan jadual waktu',
            'Mengikut keperluan sekolah',
            'Secara spesifik dan jelas'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa',
            'Menyeluruh - penubuhan panitia MP, peruntukan kewangan, pentaksiran, penjaminan kualiti (4P), latihan/ tugasan, pembelajaran digital, PdPR/ remote learning, sumber pendidikan dan jadual waktu',
            'Mengikut keperluan sekolah',
            'Secara spesifik dan jelas'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.1-3',
        title: 'ASPEK 3.1.2: PENGURUSAN MATA PELAJARAN 3.1.2.1 Pelaksanaan mata pelajaran diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat Panitia',
          'Dokumen Standard Kurikulum Prestasi',
          'Jadual Peperiksaan / Pentaksiran',
          'Analisis Pentaksiran dan Penilaian',
          'Laporan Dialog Prestasi Panitia /maklumbalas',
          'Borang Semakan Tugasan Murid',
          'Standard Kecukupan Latihan',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Memperoleh dokumen kurikulum b) Menyelaras penyediaan RPT dan RPH c) Menyelaras pentaksiran d) Menyelaras tugasan murid e) Menganalisis data dan maklumat pentaksiran f) Mengambil tindakan susulan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa',
            'Berdasarkan keperluan pelaksanaan kurikulum',
            'Secara menyeluruh meliputi semua tahun/ tingkatan'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa',
            'Berdasarkan keperluan pelaksanaan kurikulum',
            'Secara menyeluruh meliputi semua tahun/ tingkatan'
          ],
          checkboxes: [
            'Semua',
            '1 & 2 @1&3',
            '1',
            '2 @3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.1-4',
        title: 'ASPEK 3.1.2: PENGURUSAN MATA PELAJARAN 3.1.2.2 Program peningkatan kualiti pengajaran guru diurus secara terancang',
        evidenceLabels: [
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Panitia',
          'Takwim CPD Mata Pelajaran',
          'OPPM Panitia',
          'OPR Program Panitia',
          'Laporan PLC Panitia / SPLKPM',
          'Laporan PLC Panitia/SPLKPM',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang dan melaksanakan program pembangunan profesionalisme yang berkaitan dengan mata pelajaran b) Menilai keberkesanan program c) Mengambil tindakan susulan'
        ],
        do: {
          text: '',
          suggestions: [
            'Berfokus kepada keperluan guru/ panitia',
            'Mengambil kira perkembangan pendidikan semasa',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Berfokus kepada keperluan guru/ panitia',
            'Mengambil kira perkembangan pendidikan semasa',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & 2 @1&3',
            '1',
            '2 @3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.1-5',
        title: 'ASPEK 3.1.2: PENGURUSAN MATA PELAJARAN 3.1.2.3 Program peningkatan pencapaian murid diurus secara profesional dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat Panitia',
          'Kertas Kerja Program Kecemerlangan Murid',
          'OPR Program Kecemerlangan Murid',
          'Laporan / Analisis PBD Pertengahan Tahun',
          'Dialog Prestasi Panitia',
          'Laporan program intervensi',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang dan melaksanakan program yang menjurus ke arah peningkatan ilmu dan kemahiran b) Menilai keberkesanan program c) Mengambil tindakan susulan'
        ],
        do: {
          text: '',
          suggestions: [
            'Berfokus kepada keperluan murid',
            'Mengambil kira tahap keupayaan dan potensi murid',
            'Melibatkan murid di semua tahun/ tingkatan',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Berfokus kepada keperluan murid',
            'Mengambil kira tahap keupayaan dan potensi murid',
            'Melibatkan murid di semua tahun/ tingkatan',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.1-6',
        title: 'ASPEK 3.1.2: PENGURUSAN MATA PELAJARAN 3.1.2.4 Bantuan geran perkapita mata pelajaran dimanfaatkan secara sistematik dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat Panitia',
          'Anggaran Perbelanjaan Panitia',
          'Laporan Kewangan Panitia',
          'Rekod Pinjaman & Penggunaan Peralatan',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang dan melaksanakan perbelanjaan b) Memanfaatkan sumber pendidikan c) Merekod penerimaan dan penggunaan sumber pendidikan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut prosedur yang ditetapkan',
            'Mengikut keperluan',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mengikut prosedur yang ditetapkan',
            'Mengikut keperluan',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.1-7',
        title: 'ASPEK 3.1.3: PENGURUSAN MASA INSTRUKSIONAL 3.1.3.1 Masa pelaksanaan PdP diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Minit mesyuarat kurikulum',
          'Jadual Waktu PdPc - Induk / Kelas / Guru / Bilik Khas',
          'Rekod Jadual Guru Ganti',
          'Rekod Penggunaan Bilik Khas',
          'Laporan Learning Walk',
          'Takwim Pengurusan Sekolah/OPPM',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Menyediakan JW induk, JW kelas, JW guru, JW guru ganti dan JW penggunaan bilik khas b) Melaksanakan PdP seperti yang dijadualkan c) Menyusun semula JW d) Menyelaras program sekolah'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa',
            'Mengikut ketetapan kurikulum',
            'Mengikut kesesuaian'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa',
            'Mengikut ketetapan kurikulum',
            'Mengikut kesesuaian'
          ],
          checkboxes: [
            'Semua',
            '1 & 2 @1&3',
            '1',
            '2 @3',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.1-8',
        title: 'ASPEK 3.1.4: PENGURUSAN PENILAIAN MURID 3.1.4.1 Peperiksaan dan pentaksiran diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat Pengurusan Kurikulum',
          'Takwim / Jadual Peperiksaan dan Pentaksiran Sekolah',
          'Analisis Data Peperiksaan dan Pentaksiran Sekolah',
          'Dialog Prestasi',
          'Laporan Penjaminan Kualiti PBD',
          'Program Intervensi',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang, menyelaras dan melaksanakan peperiksaan dan pentaksiran b) Menganalisis data dan maklumat peperiksaan dan pentaksiran c) Mengambil tindakan susulan/ intervensi'
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut arahan yang berkuatkuasa',
            'Mengikut keperluan',
            'Secara menyeluruh meliputi semua mata pelajaran dan murid',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mengikut arahan yang berkuatkuasa',
            'Mengikut keperluan',
            'Secara menyeluruh meliputi semua mata pelajaran dan murid',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
    ],
  },
  '3.2': {
    standardCode: '3.2',
    pages: [
      {
        code: '3.2-2',
        title: 'ASPEK 3.2.1: KETETAPAN PELAKSANAAN KOKURIKULUM 3.2.1.1 Pelaksanaan kokurikulum diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Perancangan Strategik/PInTaS/OPPM Unit Kokurikulum',
          'Minit Mesyuarat Pengurusan Kokurikulum',
          'Buku Pengurusan Sekolah',
          'Takwim Unit Kokurikulum Sekolah',
          'Surat Pelantikan Guru Penasihat Kokurikulum',
          'Papan Kenyataan Unit Kokurikulum',
          'Facebook sekolah',
          'Group whatsapp/telegram',
          'Buku laporan guru bertugas mingguan',
          'Laporan Taklimat PAJSK (Program Orientasi Murid Baru)',
          'Laporan dialog prestasi',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Membuat ketetapan b) Mendokumenkan ketetapan c) Menyebarluaskan ketetapan d) Menyemak semula ketetapan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa',
            'Menyeluruh – pendaftaran, penubuhan, keahlian, hari dan masa perjumpaan, perancangan tahunan, kewangan, pentaksiran, penjaminan kualiti dan penghargaan',
            'Mengikut keperluan sekolah',
            'Secara spesifik dan jelas'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa',
            'Menyeluruh – pendaftaran, penubuhan, keahlian, hari dan masa perjumpaan, perancangan tahunan, kewangan, pentaksiran, penjaminan kualiti dan penghargaan',
            'Mengikut keperluan sekolah',
            'Secara spesifik dan jelas'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.2-3',
        title: 'ASPEK 3.2.2: PENGURUSAN KELAB/PERSATUAN 3.2.2.1 Kelab/persatuan diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Pengurusan Kokurikulum',
          'Takwim Tahunan Kelab/Persatuan',
          'OPPM Kelab/Persatuan',
          'Buku / OPR Kelab/Persatuan',
          'Rekod Laporan Aktiviti Unit',
          'Dialog Prestasi Kokurikulum',
          'Analisis Data',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang aktiviti berteraskan ilmu pengetahuan, kemahiran dan kreativiti/ inovasi b) Melaksanakan aktiviti yang dirancang c) Merekod data dan maklumat d) Menganalisis data dan maklumat e) Mengambil tindakan susulan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa/ kurikulum/ modul bagi kelab/ persatuan',
            'Mengikut keperluan',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa/ kurikulum/ modul bagi kelab/ persatuan',
            'Mengikut keperluan',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.2-4',
        title: 'ASPEK 3.2.3: PENGURUSAN BADAN BERUNIFORM 3.2.3.1 Badan beruniform diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Pengurusan Kokurikulum',
          'Takwim Tahunan Badan Beruniform',
          'OPPM Badan Beruniform',
          'Buku / OPR Badan Beruniform',
          'Rekod Laporan Aktiviti Unit',
          'Dialog Prestasi Kokurikulum',
          'Analisis Data',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang aktiviti berteraskan ilmu pengetahuan, kemahiran dan kreativiti/ inovasi b) Melaksanakan aktiviti yang dirancang c) Merekod data dan maklumat d) Menganalisis data dan maklumat e) Mengambil tindakan susulan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa/ kurikulum/ modul bagi badan beruniform',
            'Mengikut keperluan',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa/ kurikulum/ modul bagi badan beruniform',
            'Mengikut keperluan',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.2-5',
        title: 'ASPEK 3.2.4: PENGURUSAN SUKAN DAN PERMAINAN 3.2.4.1 Sukan dan permainan diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Pengurusan Kokurikulum',
          'Takwim Tahunan Sukan/Permainan',
          'OPPM Sukan/Permainan',
          'Buku / OPR Sukan/Permainan',
          'Rekod Laporan Aktiviti Unit',
          'Dialog Prestasi Kokurikulum',
          'Analisis Data',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang aktiviti berteraskan ilmu pengetahuan, kemahiran dan kreativiti/ inovasi b) Melaksanakan aktiviti yang dirancang c) Merekod data dan maklumat d) Menganalisis data dan maklumat e) Mengambil tindakan susulan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa/ kurikulum/ modul bagi sukan dan permainan',
            'Mengikut keperluan',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa/ kurikulum/ modul bagi sukan dan permainan',
            'Mengikut keperluan',
            'Secara menyeluruh',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.2-6',
        title: 'ASPEK 3.2.5: PENGURUSAN PROGRAM KECEMERLANGAN KOKURIKULUM 3.2.5.1 Program kecemerlangan kokurikulum diurus secara profesional dan terancang',
        evidenceLabels: [
          'Takwim Unit Kokurikulum',
          'Minit Mesyuarat Pengurusan Kokurikulum',
          'Kertas Kerja Program/Aktiviti',
          'OPR/Laporan Program',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang dan melaksanakan latihan peningkatan kemahiran b) Merancang dan melaksanakan program pemantapan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mengikut keperluan dan kesesuaian',
            'Secara menyeluruh melibatkan sekurang - kurangnya satu unit bagi setiap kelab/ persatuan, badan beruniform dan sukan/ permainan',
            'Dari semasa ke semasa',
            'Secara kreatif/ inovatif'
          ]
        },
        check: {
          criteria: [
            'Mengikut keperluan dan kesesuaian',
            'Secara menyeluruh melibatkan sekurang - kurangnya satu unit bagi setiap kelab/ persatuan, badan beruniform dan sukan/ permainan',
            'Dari semasa ke semasa',
            'Secara kreatif/ inovatif'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.2-7',
        title: 'ASPEK 3.2.6: PENGURUSAN SUKAN UNTUK SEMUA 3.2.6.1 Aktiviti sukan untuk semua diurus secara profesional dan terancang',
        evidenceLabels: [
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Pengurusan Kokurikulum',
          'Kertas Kerja Program - (Kejohanan Merentas Desa / Sukan Tara / Kejohanan Olahraga Tahunan / Pertandingan antara Asrama)',
          'Takwim unit Kokurikulum',
          'Laporan Sukan Tara',
          'Laporan Kejohanan Olahraga Sekolah',
          'Laporan Pertandingan Antara Dorm',
          'Laporan Kejohanan Merentas Desa',
          'Facebook Sekolah',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang kejohanan merentas desa, sukan tara, kejohanan olahraga tahunan, pertandingan antara tingkatan/kelas/rumah/dorm asrama/kelab sukan sekolah b) Melaksanakan kejohanan merentas desa, sukan tara, kejohanan olahraga tahunan, pertandingan antara tingkatan/kelas/rumah/dorm asrama/kelab sukan sekolah'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa',
            'Secara menyeluruh melibatkan semua murid yang berkenaan',
            'Mengikut keperluan',
            'Secara kreatif/inovatif'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa',
            'Secara menyeluruh melibatkan semua murid yang berkenaan',
            'Mengikut keperluan',
            'Secara kreatif/inovatif'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.2-8',
        title: 'ASPEK 3.2.7: PENGURUSAN PENTAKSIRAN KOKURIKULUM 3.2.7.1 Pentaksiran kokurikulum dilaksanakan secara sistematik dan terancang',
        evidenceLabels: [
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Pengurusan Kokurikulum',
          'Laporan Taklimat PAJSK (Murid/Guru) - Orientasi Murid Baru',
          'Buku Laporan Aktiviti Kokurikulum',
          'Laporan Dialog Prestasi Unit kokurikulum',
          'Laporan Program Intervensi Kokurikulum',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang dan melaksanakan pentaksiran b) Menganalisis data dan maklumat pentaksiran c) Mengambil tindakan susulan/intervensi'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa',
            'Mengikut keperluan',
            'Secara menyeluruh meliputi setiap murid yang terlibat',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa',
            'Mengikut keperluan',
            'Secara menyeluruh meliputi setiap murid yang terlibat',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
    ],
  },
  '3.3': {
    standardCode: '3.3',
    pages: [
      {
        code: '3.3-2',
        title: 'ASPEK 3.3.1: KETETAPAN PELAKSANAAN HAL EHWAL MURID 3.3.1.1 Pelaksanaan hal ehwal murid diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Buku Tatacara Pengendalian Disiplin',
          'Buku Peraturan Sekolah / Asrama',
          'Fail Surat - Surat Pekeliling',
          'Perancangan Strategik / PInTaS / OPPM HEM',
          'Buku Pengurusan Sekolah',
          'Minit Mesyuarat Pengurusan HEM',
          'Takwim Unit HEM',
          'Pamplet / Surat Edaran / Media Sosial',
          'Laporan Dialog Prestasi Unit HEM',
          'Papan Kenyataan Unit HEM',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Membuat ketetapan b) Mendokumenkan ketetapan c) Menyebarluaskan ketetapan d) Menyemak semula ketetapan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi prosedur',
            'Menyeluruh – disiplin, keselamatan, kesihatan, bantuan pelajaran murid, serta perkhidmatan bimbingan dan kaunseling',
            'Mengikut keperluan dan kesesuaian sekolah',
            'Secara jelas dan spesifik'
          ]
        },
        check: {
          criteria: [
            'Mematuhi prosedur',
            'Menyeluruh – disiplin, keselamatan, kesihatan, bantuan pelajaran murid, serta perkhidmatan bimbingan dan kaunseling',
            'Mengikut keperluan dan kesesuaian sekolah',
            'Secara jelas dan spesifik'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.3-3',
        title: 'ASPEK 3.3.2: PENGURUSAN DISIPLIN MURID 3.3.2.1 Disiplin murid diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Buku Tatacara Pengendalian Disiplin',
          'Buku Peraturan Sekolah / Asrama',
          'Fail - Fail Disiplin Sekolah',
          'Takwim HEM',
          'Minit Mesyuarat Pengurusan HEM',
          'Minit Mesyuarat Lembaga Disiplin Sekolah',
          'Peraturan Sekolah - Papan Kenyataan Kelas',
          'Buku Laporan Guru Bertugas Mingguan',
          'Laporan program anti - buli dan gangguan seksual',
          'e - Cakna Belajar / Buku Kawalan Kelas',
          'Rekod Analisis Data Disiplin Murid (SSDM)',
          'Rekod Analisis Data Kehadiran Murid (APDM)',
          'OPR Program Guru Penyayang',
          'OPR Taklimat Disiplin',
          'OPR Program Peningkatan Disiplin',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Meyebarluas dan menguatkuasakan peraturan sekolah b) Menganalisis data disiplin c) Merancang dan melaksanakan program pendidikan disiplin'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi prosedur dan ketetapan disiplin/ arahan yang berkuatkuasa',
            'Secara menyeluruh kepada semua murid',
            'Dari semasa ke semasa',
            'Dengan mekanisme yang sesuai mengikut keperluan'
          ]
        },
        check: {
          criteria: [
            'Mematuhi prosedur dan ketetapan disiplin/ arahan yang berkuatkuasa',
            'Secara menyeluruh kepada semua murid',
            'Dari semasa ke semasa',
            'Dengan mekanisme yang sesuai mengikut keperluan'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.3-4',
        title: 'ASPEK 3.3.3: PENGURUSAN KESELAMATAN MURID 3.3.3.1 Keselamatan murid diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Buku Sekolah Selamat',
          'Panduan Pengurusan Risiko /Pengurusan Keselamatan Sekolah/ Taklimat SOP Keselamatan Murid',
          'Buku Peraturan Sekolah / Asrama',
          'Fail 3K (keselamatan, Kesihatan, kebersihan)',
          'Buku Laporan Guru Bertugas Mingguan',
          'Peraturan Sekolah - Papan Kenyataan Kelas',
          'Pelan Laluan Keselamatan - Kebakaran & Bencana',
          'Kad Keluar/Masuk Kelas',
          'Papan & Label Tanda Keselamatan',
          'Poster / Kempen / Pamplet / Brosur keselamatan',
          'Laporan program keselamatan',
          'Laporan pelaksanaan kawad kebakaran',
          'Laporan pengurusan bencana',
          'Fail laporan 1 : 3 : 7',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Menyebarluas dan menguatkuasakan peraturan dan prosedur operasi standard keselamatan b) Merancang dan melaksanakan program pencegahan dan kesedaran keselamatan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi ketetapan keselamatan dan arahan yang berkuatkuasa',
            'Secara menyeluruh dalam semua aspek keselamatan kepada warga sekolah dan ibu bapa/komuniti',
            'Dari semasa ke semasa',
            'Dengan mekanisme yang sesuai'
          ]
        },
        check: {
          criteria: [
            'Mematuhi ketetapan keselamatan dan arahan yang berkuatkuasa',
            'Secara menyeluruh dalam semua aspek keselamatan kepada warga sekolah dan ibu bapa/komuniti',
            'Dari semasa ke semasa',
            'Dengan mekanisme yang sesuai'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.3-5',
        title: 'ASPEK 3.3.4: PENGURUSAN KESIHATAN MURID 3.3.4.1 Program dan perkhidmatan kesihatan murid diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat Pengurusan HEM',
          'Perancangan Tahunan Unit Kesihatan Sekolah',
          'Fail 3K (keselamatan, Kesihatan, kebersihan)',
          'OPR Program Pencegahan dan kesedaran kesihatan',
          'Papan Kenyataan / Poster / Banner / Pamplet Info Kesihatan',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Menyelaras pemeriksaan kesihatan/rawatan/imunisasi b) Merancang dan melaksanakan program pencegahan dan kesedaran kesihatan c) Mewujudkan persekitaran yang bermaklumat tentang kesihatan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi prosedur, arahan dan ketetapan perkhidmatan kesihatan yang berkuatkuasa',
            'Secara menyeluruh meliputi semua aspek kesihatan',
            'Dari semasa ke semasa',
            'Mengikut keperluan dengan mekanisme yang sesuai'
          ]
        },
        check: {
          criteria: [
            'Mematuhi prosedur, arahan dan ketetapan perkhidmatan kesihatan yang berkuatkuasa',
            'Secara menyeluruh meliputi semua aspek kesihatan',
            'Dari semasa ke semasa',
            'Mengikut keperluan dengan mekanisme yang sesuai'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.3-6',
        title: 'ASPEK 3.3.5: PENGURUSAN BANTUAN PELAJARAN MURID 3.3.5.1 Bantuan pelajaran murid diurus secara sistematik dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat Pengurusan HEM',
          'Minit Mesyuarat JK Bantuan Sekolah',
          'Rekod Analisis Data APDM / SSDM',
          'Rekod Murid Penerima Bantuan',
          'Analisis Keputusan Ujian/ Peperiksaan Penerima Bantuan',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Mengenal pasti semua jenis bantuan b) Mengenal pasti murid yang layak c) Merekod maklumat murid yang menerima bantuan d) Memantau prestasi/kemajuan murid yang menerima bantuan'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa dan ketetapan bantuan pelajaran murid',
            'Secara menyeluruh kepada semua murid',
            'Dari semasa ke semasa',
            'Dengan mekanisme yang sesuai'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa dan ketetapan bantuan pelajaran murid',
            'Secara menyeluruh kepada semua murid',
            'Dari semasa ke semasa',
            'Dengan mekanisme yang sesuai'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.3-7',
        title: 'ASPEK 3.3.6: PENGURUSAN PERKHIDMATAN BIMBINGAN DAN KAUNSELING 3.3.6.1 Perkhidmatan bimbingan dan kaunseling diurus secara profesional dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat Pengurusan HEM',
          'Rancangan Tahunan Perkhidmatan Bimbingan & Kaunseling',
          'Rekod Perkhidmatan Kaunseling Murid',
          'OPR Program Bimbingan & Kaunseling',
          'Laporan bimbingan individu / kelompok',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang dan melaksanakan sesi bimbingan dan kaunseling b) Merancang dan melaksanakan program bimbingan dan kaunseling'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa',
            'Mengikut keperluan murid',
            'Dari semasa ke semasa',
            'Dengan mekanisme yang sesuai mengikut keperluan dan kesesuaian'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa',
            'Mengikut keperluan murid',
            'Dari semasa ke semasa',
            'Dengan mekanisme yang sesuai mengikut keperluan dan kesesuaian'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
      {
        code: '3.3-8',
        title: 'ASPEK 3.3.7: PENGURUSAN PENTAKSIRAN PSIKOMETRIK 3.3.7.1 Pentaksiran psikometrik diurus secara profesional dan terancang',
        evidenceLabels: [
          'Minit Mesyuarat JK Bimbingan & Kaunseling',
          'Perancangan Tahunan @ Jadual Pelaksanaan Psikometrik',
          'Analisis Data Ujian Psikometrik',
          'Laporan Program Intervensi Ujian Psikometrik',
          'Fail eviden pentaksiran psikometrik',
          'OPR perkongsian dapatan pentaksiran psikometrik kepada guru',
          'Lain - lain',
        ],
        plan: [
          'Membimbing SLT: a) Merancang dan melaksanakan pentaksiran b) Menganalisis data dan maklumat pentaksiran c) Mengambil tindakan susulan/intervensi/konsultasi'
        ],
        do: {
          text: '',
          suggestions: [
            'Mematuhi arahan yang berkuatkuasa',
            'Mengikut keperluan murid/ isu',
            'Secara menyeluruh meliputi setiap murid yang terlibat',
            'Dari semasa ke semasa'
          ]
        },
        check: {
          criteria: [
            'Mematuhi arahan yang berkuatkuasa',
            'Mengikut keperluan murid/ isu',
            'Secara menyeluruh meliputi setiap murid yang terlibat',
            'Dari semasa ke semasa'
          ],
          checkboxes: [
            'Semua',
            '1 & mana-mana dua perkara',
            '1 & mana-mana satu perkara',
            '1 sahaja',
            'Tiada'
          ]
        },
        act: {
          text: '',
          suggestions: [
            'Tindakan susulan berdasarkan penilaian yang dibuat',
            'Mengadakan program pembangunan berterusan',
            'Memantau dan menilai keberkesanan pelaksanaan'
          ]
        }
      },
    ],
  },
}


