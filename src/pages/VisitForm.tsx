import SEO from "@/components/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Save, Download, Building2, Calendar, User, Crown, Settings, BookOpen, Trophy, Users, Camera, History, Copy, RotateCcw, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { sectionCoords, standardPages } from "@/pdf/coordinates";
import { standardsConfig } from "@/standards/config";
import { ImageUpload } from "@/components/ui/image-upload";
import { AutoCloneModal } from "@/components/ui/auto-clone-modal";
import { AutoFilledBadge } from "@/components/ui/auto-filled-badge";

const VisitForm = () => {
  const { id: editVisitId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!editVisitId;
  const [isLoading, setIsLoading] = useState(true);
  
  // Add a small delay to prevent flash of loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const standards = [
    {
      id: "s1",
      code: "Standard 1",
      title: "Kepimpinan",
      description: "Leadership and vision assessment",
      icon: Crown,
      color: "bg-blue-500"
    },
    {
      id: "s2", 
      code: "Standard 2",
      title: "Pengurusan Organisasi",
      description: "Organizational management evaluation",
      icon: Settings,
      color: "bg-green-500"
    },
    {
      id: "s31",
      code: "Standard 3.1", 
      title: "Pengurusan Kurikulum",
      description: "Curriculum management review",
      icon: BookOpen,
      color: "bg-purple-500"
    },
    {
      id: "s32",
      code: "Standard 3.2",
      title: "Pengurusan Kokurikulum", 
      description: "Co-curricular activities management",
      icon: Trophy,
      color: "bg-orange-500"
    },
    {
      id: "s33",
      code: "Standard 3.3",
      title: "Pengurusan Hal Ehwal Murid",
      description: "Student affairs management",
      icon: Users,
      color: "bg-pink-500"
    }
  ];

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [schoolId, setSchoolId] = useState<string | undefined>();
  const [visitDate, setVisitDate] = useState<string>("");
  const [officer, setOfficer] = useState<string>("");
  const [pgb, setPgb] = useState<string>("");
  const [sesiBimbingan, setSesiBimbingan] = useState<string>("");

  const { data: schools } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("id,name,category").eq("district", "Raub").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  // Load existing visit data when editing
  const { data: existingVisit } = useQuery({
    queryKey: ["visit", editVisitId],
    queryFn: async () => {
      if (!editVisitId) return null;
      const { data, error } = await supabase
        .from("visits")
        .select(`
          *,
          schools(name),
          visit_sections(section_code, score, evidences, remarks),
          visit_pages(standard_code, page_code, data)
        `)
        .eq("id", editVisitId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!editVisitId,
  });

  // Load existing visit images when editing
  const { data: existingImages } = useQuery({
    queryKey: ["visit-images", editVisitId],
    queryFn: async () => {
      if (!editVisitId) return [];
      const { data, error } = await supabase
        .from("visit_images")
        .select("*")
        .eq("visit_id", editVisitId)
        .order("uploaded_at", { ascending: true });
      if (error) throw error;
      
      // Add public URLs to images
      const imagesWithUrls = (data || []).map(img => ({
        ...img,
        public_url: supabase.storage
          .from('visit-images')
          .getPublicUrl(img.filename).data.publicUrl
      }));
      
      return imagesWithUrls;
    },
    enabled: !!editVisitId,
  });

  type LocalSection = { 
    code: string; // Now allows page codes like '1-2', '1-3', etc.
    standardCode: string; // The standard this page belongs to
    pageCode: string; // The specific page code
    score?: number|null; 
    evidences: boolean[]; 
    remarks?: string;
    doText?: string;
    actText?: string;
    lainLainText?: string;
  };
  
  // Initialize sections for all pages in all standards
  const initializeSections = () => {
    const sections: Record<string, LocalSection> = {};
    
    Object.keys(standardsConfig).forEach(standardCode => {
      const standard = standardsConfig[standardCode];
      if (standard?.pages) {
        standard.pages.forEach(page => {
          const sectionKey = `${standardCode}-${page.code}`;
          sections[sectionKey] = {
            code: sectionKey,
            standardCode: standardCode,
            pageCode: page.code,
            evidences: Array(page.evidenceLabels?.length ?? 0).fill(false),
            doText: '',
            actText: '',
            lainLainText: ''
          };
        });
      }
    });
    
    return sections;
  };
  
  const [localSections, setLocalSections] = useState<Record<string, LocalSection>>(initializeSections());

  // Debug function to log state changes
  const debugLog = (action: string, standardCode: string, data: any) => {
    console.log(`[DEBUG] ${action} for Standard ${standardCode}:`, data);
  };

  // page navigation per standard (e.g., 1-2 → 1-3)
  const [pageIndex, setPageIndex] = useState<Record<string, number>>({ '1': 0, '2': 0, '3.1': 0, '3.2': 0, '3.3': 0 });
  // per-page state (doText, checkScore, actText, evidences[], lainLainText)
  const [pagesState, setPagesState] = useState<Record<string, { doText: string; checkScore: number|null; actText: string; evidences: boolean[]; lainLainText?: string }>>({});

  // State for managing visit images
  const [visitImages, setVisitImages] = useState<Array<{
    id: string;
    filename: string;
    original_name: string;
    description?: string;
    section_code?: string;
    uploaded_at: string;
    public_url?: string;
  }>>([]);
  const [currentVisitId, setCurrentVisitId] = useState<string | undefined>();
  const [isDraftCreated, setIsDraftCreated] = useState(false);

  // State for auto-clone functionality
  const [showAutoCloneModal, setShowAutoCloneModal] = useState(false);
  const [autoCloneType, setAutoCloneType] = useState<'within-standard' | 'from-last-visit'>('within-standard');
  const [autoCloneStandard, setAutoCloneStandard] = useState<string>('');
  const [autoFilledFields, setAutoFilledFields] = useState<Record<string, Set<string>>>({});

  const currentPageCode = (std: string) => standardPages[std]?.[pageIndex[std] ?? 0];
  const currentPageSchema = (std: string) => {
    const cfg = standardsConfig[std];
    const code = currentPageCode(std);
    return cfg.pages.find((p) => p.code === code);
  };

  // Create draft visit immediately when school is selected
  const createDraftVisit = async () => {
    if (!schoolId || isDraftCreated) return;
    
    try {
      const { data: user } = await supabase.auth.getUser();
      const officerId = user.user?.id;
      if (!officerId) return;

      // Ensure profile exists
      await supabase.from('profiles').upsert({ id: officerId, name: officer || null }, { onConflict: 'id' });
      
      // Create draft visit
      const { data: visit, error } = await supabase
        .from("visits")
        .insert({ 
          school_id: schoolId, 
          officer_id: officerId, 
          visit_date: visitDate || undefined, 
          status: 'draft' 
        })
        .select("id")
        .single();
      
      if (error) throw error;
      
      setCurrentVisitId(visit.id);
      setIsDraftCreated(true);
      toast({ title: "Draft visit created", description: "You can now upload images and fill the form" });
      
    } catch (error: any) {
      console.error('Error creating draft visit:', error);
      toast({ title: "Failed to create draft", description: error.message, variant: "destructive" });
    }
  };

  // Auto-create draft when school is selected
  useEffect(() => {
    if (schoolId && !isEditing) {
      createDraftVisit();
    }
  }, [schoolId]);

  // Effect to populate form when editing
  useEffect(() => {
    if (isEditing && existingVisit) {
      setSchoolId(existingVisit.school_id);
      setVisitDate(existingVisit.visit_date || '');
      setOfficer(existingVisit.officer_name || '');
      setPgb(existingVisit.pgb || '');
      setSesiBimbingan(existingVisit.sesi_bimbingan || '');
      setVisitImages(existingImages || []);

      // Initialize localSections with all possible pages first
      const initialSections: any = {};
      const allStandards = ['1', '2', '3.1', '3.2', '3.3'] as const;
      
      for (const std of allStandards) {
        const stdCfg = standardsConfig[std];
        if (!stdCfg) continue;
        
        const standardPages = stdCfg.pages || [];
        for (const page of standardPages) {
          const pageKey = `${std}-${page.code}`;
          initialSections[pageKey] = {
            code: pageKey,
            standardCode: std,
            pageCode: page.code,
            score: undefined,
            evidences: [],
            remarks: '',
            doText: '',
            actText: '',
            lainLainText: ''
          };
        }
      }

      // Populate localSections from existingVisit.visit_pages (new structure)
      if (existingVisit.visit_pages) {
        for (const pageData of existingVisit.visit_pages) {
          const pageKey = `${pageData.standard_code}-${pageData.page_code}`;
          if (initialSections[pageKey] && pageData.data) {
            initialSections[pageKey] = {
              ...initialSections[pageKey],
              score: pageData.data.score ?? undefined,
              evidences: pageData.data.evidences || [],
              remarks: pageData.data.remarks || '',
              doText: pageData.data.doText || '',
              actText: pageData.data.actText || '',
              lainLainText: pageData.data.lainLainText || ''
            };
          }
        }
      }

      // Also populate from visit_sections for backward compatibility
      if (existingVisit.visit_sections) {
        for (const section of existingVisit.visit_sections) {
          const stdCode = section.section_code;
          const standardPages = standardsConfig[stdCode]?.pages || [];
          
          for (const page of standardPages) {
            const pageKey = `${stdCode}-${page.code}`;
            if (initialSections[pageKey]) {
              initialSections[pageKey] = {
                ...initialSections[pageKey],
                score: section.score ?? undefined,
                evidences: section.evidences || [],
                remarks: section.remarks || ''
              };
            }
          }
        }
      }

      setLocalSections(initialSections);

      // Set currentVisitId if it's an existing visit
      setCurrentVisitId(existingVisit.id);
      setIsDraftCreated(existingVisit.status === 'draft');
    }
  }, [isEditing, existingVisit, existingImages]);

  // Calculate completion progress based on standards, not pages
  const completionProgress = useMemo(() => {
    const standards = ['1', '2', '3.1', '3.2', '3.3'];
    let completedStandards = 0;
    
    for (const std of standards) {
      // Check if any page in this standard has content
      const hasContent = Object.values(localSections).some(section => {
        if (section.standardCode !== std) return false;
        
        const hasScore = typeof section.score === 'number';
        const hasRemarks = section.remarks && section.remarks.trim().length > 0;
        const hasDoText = section.doText && section.doText.trim().length > 0;
        const hasActText = section.actText && section.actText.trim().length > 0;
        const hasEvidences = section.evidences && section.evidences.some(Boolean);
        
        return hasScore || hasRemarks || hasDoText || hasActText || hasEvidences;
      });
      
      if (hasContent) completedStandards++;
    }
    
    return {
      completed: completedStandards,
      total: standards.length,
      percentage: Math.round((completedStandards / standards.length) * 100)
    };
  }, [localSections]);

  // Function to get individual standard status
  const getStandardStatus = (standardCode: string) => {
    // Find all sections that belong to this standard
    const standardSections = Object.values(localSections).filter(section => 
      section.standardCode === standardCode
    );
    
    if (standardSections.length === 0) return 'Not Started';
    
    // Check if any section has content
    const hasAnyContent = standardSections.some(section => {
      const hasScore = typeof section.score === 'number';
      const hasRemarks = section.remarks && section.remarks.trim().length > 0;
      const hasDoText = section.doText && section.doText.trim().length > 0;
      const hasActText = section.actText && section.actText.trim().length > 0;
      const hasEvidences = section.evidences && section.evidences.some(Boolean);
      
      return hasScore || hasRemarks || hasDoText || hasActText || hasEvidences;
    });
    
    if (hasAnyContent) {
      return 'In Progress';
    }
    
    return 'Not Started';
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      const officerId = user.user?.id;
      if (!officerId || !schoolId) throw new Error("Select school first");
      if (!officer || officer.trim().length === 0) throw new Error("Nama Pegawai is required");
      
      // Determine visit status based on completion
      const completedStandards = Object.values(localSections).filter(s => {
        const hasScore = typeof s.score === 'number';
        const hasRemarks = s.remarks && s.remarks.trim().length > 0;
        const hasDoText = s.doText && s.doText.trim().length > 0;
        const hasActText = s.actText && s.actText.trim().length > 0;
        const hasEvidences = s.evidences && s.evidences.some(Boolean);
        
        return hasScore || hasRemarks || hasDoText || hasActText || hasEvidences;
      }).length;
      
      const visitStatus = completedStandards >= 3 ? 'completed' : 'draft';
      
      // Ensure a matching profile row exists for FK constraint and save officer name
      await supabase.from('profiles').upsert({ id: officerId, name: officer || null }, { onConflict: 'id' });
      
      let visitId = currentVisitId;
      
      // If we have an existing visit, update it; otherwise create a new one
      if (currentVisitId) {
        // Update existing visit
        const { error } = await supabase
          .from("visits")
          .update({ 
            school_id: schoolId, 
            officer_id: officerId, 
            visit_date: visitDate || undefined, 
            status: visitStatus,
            officer_name: officer || null,
            pgb: pgb || null,
            sesi_bimbingan: sesiBimbingan || null
          })
          .eq("id", currentVisitId);
        if (error) throw error;
      } else {
        // Create new visit only if we don't have one
        const { data: visit, error } = await supabase
          .from("visits")
          .insert({ 
            school_id: schoolId, 
            officer_id: officerId, 
            visit_date: visitDate || undefined, 
            status: visitStatus,
            officer_name: officer || null,
            pgb: pgb || null,
            sesi_bimbingan: sesiBimbingan || null
          })
          .select("id")
          .single();
        if (error) throw error;
        visitId = visit.id as string;
        setCurrentVisitId(visitId);
      }
      
      // Save section data - follow the correct database design:
      // visit_sections stores standard-level summaries
      // visit_pages stores page-level detailed data
      
      // First, save standard-level summaries to visit_sections
      const standardSummaries = new Map<string, any>();
      
      // Aggregate data by standard
      for (const s of Object.values(localSections)) {
        const stdCode = s.standardCode;
        if (!standardSummaries.has(stdCode)) {
          standardSummaries.set(stdCode, {
            visit_id: visitId,
            section_code: stdCode,
            score: null,
            evidences: [],
            remarks: ''
          });
        }
        
        const summary = standardSummaries.get(stdCode);
        // Aggregate scores (take the highest score if multiple pages have scores)
        if (s.score !== undefined && s.score !== null) {
          if (summary.score === null || s.score > summary.score) {
            summary.score = s.score;
          }
        }
        // Aggregate evidences (combine all evidences from all pages)
        if (s.evidences && s.evidences.some(Boolean)) {
          summary.evidences = [...summary.evidences, ...s.evidences];
        }
        // Aggregate remarks (combine all remarks)
        if (s.remarks && s.remarks.trim()) {
          if (summary.remarks) {
            summary.remarks += '; ' + s.remarks;
          } else {
            summary.remarks = s.remarks;
          }
        }
      }
      
      // Save standard summaries to visit_sections
      for (const summary of standardSummaries.values()) {
        try {
          await supabase.from('visit_sections').upsert(summary, { onConflict: 'visit_id,section_code' });
        } catch (error) {
          console.error('Error saving section data:', error);
          // Continue with other sections even if one fails
        }
      }
      
      // Save detailed page data to visit_pages
      for (const s of Object.values(localSections)) {
        try {
          await supabase.from('visit_pages').upsert({
            visit_id: visitId,
            standard_code: s.standardCode as '1' | '2' | '3.1' | '3.2' | '3.3',
            page_code: s.pageCode,
            data: {
              score: s.score ?? null,
              evidences: s.evidences ?? [],
              remarks: s.remarks ?? '',
              doText: s.doText ?? '',
              actText: s.actText ?? '',
              lainLainText: s.lainLainText ?? ''
            }
          }, { onConflict: 'visit_id,standard_code,page_code' });
        } catch (error) {
          console.error('Error saving page data:', error);
          // Continue with other pages even if one fails
        }
      }
      
      return visitId;
    },
    onSuccess: () => {
      const completedStandards = Object.values(localSections).filter(s => {
        const hasScore = typeof s.score === 'number';
        const hasRemarks = s.remarks && s.remarks.trim().length > 0;
        const hasDoText = s.doText && s.doText.trim().length > 0;
        const hasActText = s.actText && s.actText.trim().length > 0;
        const hasEvidences = s.evidences && s.evidences.some(Boolean);
        
        return hasScore || hasRemarks || hasDoText || hasActText || hasEvidences;
      }).length;
      
      const status = completedStandards >= 3 ? 'completed' : 'draft';
      toast({ 
        title: "Saved", 
        description: `Visit saved as ${status}. ${completedStandards}/5 standards completed.` 
      });
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
    onError: (e: any) => toast({ title: "Save failed", description: e?.message ?? "Unexpected error", variant: "destructive" }),
  });

  const handleGenerate = async () => {
    try {
      const schoolName = (schools ?? []).find(s => s.id === schoolId)?.name ?? '';
      const { generateBorangPdf } = await import('@/pdf/generator');
      const sections = Object.values(localSections);
      
      // Save current progress before generating PDF (but don't create new visit)
      if (currentVisitId) {
        // Update existing visit data using the correct approach
        // Aggregate data by standard for visit_sections
        const standardSummaries = new Map<string, any>();
        
        for (const s of Object.values(localSections)) {
          const stdCode = s.standardCode;
          if (!standardSummaries.has(stdCode)) {
            standardSummaries.set(stdCode, {
              visit_id: currentVisitId,
              section_code: stdCode,
              score: null,
              evidences: [],
              remarks: ''
            });
          }
          
          const summary = standardSummaries.get(stdCode);
          if (s.score !== undefined && s.score !== null) {
            if (summary.score === null || s.score > summary.score) {
              summary.score = s.score;
            }
          }
          if (s.evidences && s.evidences.some(Boolean)) {
            summary.evidences = [...summary.evidences, ...s.evidences];
          }
          if (s.remarks && s.remarks.trim()) {
            if (summary.remarks) {
              summary.remarks += '; ' + s.remarks;
            } else {
              summary.remarks = s.remarks;
            }
          }
        }
        
        // Save standard summaries to visit_sections
        for (const summary of standardSummaries.values()) {
          try {
            await supabase.from('visit_sections').upsert(summary, { onConflict: 'visit_id,section_code' });
          } catch (error) {
            console.error('Error saving section data:', error);
            // Continue with other sections even if one fails
          }
        }
        
        // Save detailed page data to visit_pages
        for (const s of Object.values(localSections)) {
          await supabase.from('visit_pages').upsert({
            visit_id: currentVisitId,
            standard_code: s.standardCode as '1' | '2' | '3.1' | '3.2' | '3.3',
            page_code: s.pageCode,
            data: {
              score: s.score ?? null,
              evidences: s.evidences ?? [],
              remarks: s.remarks ?? '',
              doText: s.doText ?? '',
              actText: s.actText ?? '',
              lainLainText: s.lainLainText ?? ''
            }
          }, { onConflict: 'visit_id,standard_code,page_code' });
        }
      }
      
      const blob = await generateBorangPdf({ 
        schoolName, 
        visitDate, 
        sections,
        images: visitImages
      } as any);
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'borang.pdf'; a.click(); URL.revokeObjectURL(url);
    } catch (e: any) {
      toast({ title: 'PDF failed', description: e?.message ?? 'Unexpected error', variant: "destructive" });
    }
  };

  // Build a simple report PDF with the current form state (screen-like summary)
  const handleDownloadReport = async () => {
    try {
      // Show loading indicator
      toast({ title: "Generating PDF...", description: "Please wait while we prepare your report." });
      
      const schoolName = (schools ?? []).find(s => s.id === schoolId)?.name ?? '';
      const { generateVisitReportPdf, buildReportSectionsFromState } = await import('@/pdf/report');
      
      // Persist current page-level data so History can reproduce the same PDF
      if (currentVisitId) {
        for (const s of Object.values(localSections)) {
          await supabase.from('visit_pages').upsert({
            visit_id: currentVisitId,
            standard_code: s.standardCode as '1' | '2' | '3.1' | '3.2' | '3.3',
            page_code: s.pageCode,
            data: {
              score: s.score ?? null,
              evidences: s.evidences ?? [],
              remarks: s.remarks ?? '',
              doText: s.doText ?? '',
              actText: s.actText ?? '',
              lainLainText: s.lainLainText ?? ''
            }
          }, { onConflict: 'visit_id,standard_code,page_code' });
        }
      }

      // Check if there's any content in the current form state
      const hasAnyContent = Object.values(localSections).some(section => {
        return (
          (section.doText && section.doText.trim().length > 0) ||
          (section.actText && section.actText.trim().length > 0) ||
          (section.remarks && section.remarks.trim().length > 0) ||
          (section.score !== undefined && section.score !== null) ||
          (section.evidences && section.evidences.length > 0 && section.evidences.some(Boolean))
        );
      });
      
      if (!hasAnyContent) {
        toast({ title: 'Nothing to export', description: 'Fill any section to generate a report.' });
        return;
      }
      
      // build screen-like sections from current state
      const sections = buildReportSectionsFromState(localSections, pageIndex);
      
      // Ensure every image has a public_url (compute if missing)
      const imagesForReport = (visitImages || []).map((img: any) => {
        if (img.public_url) return img;
        const url = supabase.storage.from('visit-images').getPublicUrl(img.filename).data.publicUrl;
        return { ...img, public_url: url };
      });

      // Generate PDF directly without saving to database first
      const blob = await generateVisitReportPdf({ 
        schoolName, 
        visitDate, 
        officerName: officer, 
        pgb, 
        sesiBimbingan, 
        sections,
        images: imagesForReport
      } as any);
      
      const url = URL.createObjectURL(blob); 
      const a = document.createElement('a'); 
      a.href = url; 
      a.download = 'visit-report.pdf'; 
      a.click(); 
      URL.revokeObjectURL(url);
      
      // Beautiful success toast
      toast({ 
        title: "✅ Download Successful!", 
        description: "Visit report has been downloaded successfully.",
        duration: 3000,
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } catch (e: any) {
      toast({ title: 'Report failed', description: e?.message ?? 'Unexpected error', variant: "destructive" });
    }
  };

  // Auto-clone functions
  const handleAutoCloneWithinStandard = (standardCode: string) => {
    setAutoCloneType('within-standard');
    setAutoCloneStandard(standardCode);
    setShowAutoCloneModal(true);
  };

  const handleAutoCloneFromLastVisit = () => {
    setAutoCloneType('from-last-visit');
    setShowAutoCloneModal(true);
  };

  const executeAutoCloneWithinStandard = async () => {
    const stdCode = autoCloneStandard;
    if (!stdCode) return;

    // Find the current page data for this standard
    // We need to find a section that belongs to this standard to get the current data
    const currentPageData = Object.values(localSections).find(section => 
      section.standardCode === stdCode
    );
    
    if (!currentPageData) return;

    // Clone to all other pages in this standard
    const standardPages = standardsConfig[stdCode]?.pages || [];
    const updatedSections = { ...localSections };
    const updatedAutoFilled = { ...autoFilledFields };

    // Clone data to all pages in this standard
    for (const page of standardPages) {
      const pageKey = `${stdCode}-${page.code}`;
      if (!updatedAutoFilled[pageKey]) updatedAutoFilled[pageKey] = new Set();

      // Create a new section entry for each page if it doesn't exist
      if (!updatedSections[pageKey]) {
        updatedSections[pageKey] = {
          code: pageKey,
          standardCode: stdCode,
          pageCode: page.code,
          evidences: [],
          remarks: '',
          score: undefined,
          doText: '',
          actText: ''
        };
      }

      // Clone evidences
      if (currentPageData.evidences) {
        updatedSections[pageKey] = {
          ...updatedSections[pageKey],
          evidences: [...currentPageData.evidences],
        };
        updatedAutoFilled[pageKey].add('evidences');
      }

      // Clone other fields
      if (currentPageData.doText) {
        updatedSections[pageKey] = {
          ...updatedSections[pageKey],
          doText: currentPageData.doText,
        };
        updatedAutoFilled[pageKey].add('doText');
      }

      if (currentPageData.actText) {
        updatedSections[pageKey] = {
          ...updatedSections[pageKey],
          actText: currentPageData.actText,
        };
        updatedAutoFilled[pageKey].add('actText');
      }

      if (currentPageData.remarks) {
        updatedSections[pageKey] = {
          ...updatedSections[pageKey],
          remarks: currentPageData.remarks,
        };
        updatedAutoFilled[pageKey].add('remarks');
      }

      if (currentPageData.score !== undefined) {
        updatedSections[pageKey] = {
          ...updatedSections[pageKey],
          score: currentPageData.score,
        };
        updatedAutoFilled[pageKey].add('score');
      }
    }

    setLocalSections(updatedSections);
    setAutoFilledFields(updatedAutoFilled);
    toast({ 
      title: "Auto-fill completed", 
      description: `Standard ${stdCode} has been auto-filled with current data. Check for "Auto-Filled" badges on other pages.`,
      duration: 5000
    });
  };

  const executeAutoCloneFromLastVisit = async () => {
    if (!schoolId) return;

    try {
      // Get last visit data for this school by the same officer
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: lastVisit, error } = await supabase
        .from('visits')
        .select(`
          id,
          visit_sections(section_code, score, evidences, remarks),
          visit_pages(standard_code, page_code, data)
        `)
        .eq('school_id', schoolId)
        .eq('officer_id', user.user.id)
        .neq('id', currentVisitId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !lastVisit) {
        toast({ title: "No previous visit found", description: "Starting with blank forms" });
        return;
      }

      // Clone data from last visit
      const updatedSections = { ...localSections };
      const updatedAutoFilled = { ...autoFilledFields };

      // Clone visit sections (standard-level data)
      if (lastVisit.visit_sections) {
        for (const section of lastVisit.visit_sections) {
          const stdCode = section.section_code;
          // Find all pages in this standard and update them
          const standardPages = standardsConfig[stdCode]?.pages || [];
          for (const page of standardPages) {
            const pageKey = `${stdCode}-${page.code}`;
            if (updatedSections[pageKey]) {
              updatedSections[pageKey] = {
                ...updatedSections[pageKey],
                score: section.score,
                evidences: section.evidences || [],
                remarks: section.remarks,
              };

              if (!updatedAutoFilled[pageKey]) updatedAutoFilled[pageKey] = new Set();
              updatedAutoFilled[pageKey].add('score');
              updatedAutoFilled[pageKey].add('evidences');
              updatedAutoFilled[pageKey].add('remarks');
            }
          }
        }
      }

      // Clone visit pages data (page-level data)
      if (lastVisit.visit_pages) {
        
        for (const page of lastVisit.visit_pages) {
          const stdCode = page.standard_code;
          const pageCode = page.page_code;
          const pageData = page.data || {};
          const pageKey = `${stdCode}-${pageCode}`;

          if (updatedSections[pageKey]) {
            updatedSections[pageKey] = {
              ...updatedSections[pageKey],
              doText: pageData.doText || '',
              actText: pageData.actText || '',
              lainLainText: pageData.lainLainText || '',
            };

            if (!updatedAutoFilled[pageKey]) updatedAutoFilled[pageKey] = new Set();
            if (pageData.doText) updatedAutoFilled[pageKey].add('doText');
            if (pageData.actText) updatedAutoFilled[pageKey].add('actText');
            if (pageData.lainLainText) updatedAutoFilled[pageKey].add('lainLainText');
          }
        }
      }

      setLocalSections(updatedSections);
      setAutoFilledFields(updatedAutoFilled);
      toast({ 
        title: "Data copied successfully", 
        description: "Previous visit data has been copied to this form. Check for 'Auto-Filled' badges on sections.",
        duration: 5000
      });

    } catch (error: any) {
      console.error('Error copying from last visit:', error);
      toast({ title: "Copy failed", description: error.message, variant: "destructive" });
    }
  };

  // Show loading state briefly to prevent white screen
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading visit form...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="New Visit • SIP+ Visit Tracking"
        description="Record a comprehensive SIP+ school visit across all 5 standards: Leadership, Organization, Curriculum, Co-curriculum, and Student Affairs. Generate official borang PDF reports."
      />
      
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">New School Visit</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Record your comprehensive school assessment across all SIP+ standards and generate the official borang PDF.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          {/* Visit Details Header */}
          <Card className="gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-3">
                <Building2 className="w-6 h-6 text-primary" />
                Visit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="school" className="text-sm font-medium text-foreground">Sekolah</Label>
                  <Select value={schoolId} onValueChange={setSchoolId}>
                    <SelectTrigger className="h-12 bg-background/50 border-border/50">
                      <SelectValue placeholder="Pilih sekolah..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(schools ?? []).map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name} ({s.category})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-foreground">Tarikh</Label>
                  <Input
                    id="date"
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="h-12 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="officer" className="text-sm font-medium text-foreground">
                    Nama Pegawai <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="officer"
                    placeholder="Nama pegawai..."
                    value={officer}
                    onChange={(e) => setOfficer(e.target.value)}
                    className={`h-12 bg-background/50 border-border/50 focus:border-primary ${
                      !officer || officer.trim().length === 0 ? 'border-red-300' : ''
                    }`}
                  />
                  {(!officer || officer.trim().length === 0) && (
                    <p className="text-xs text-red-500">Nama Pegawai is required</p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pgb" className="text-sm font-medium text-foreground">PGB</Label>
                  <Input
                    id="pgb"
                    placeholder="PGB..."
                    value={pgb}
                    onChange={(e) => setPgb(e.target.value)}
                    className="h-12 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sesiBimbingan" className="text-sm font-medium text-foreground">SESI BIMBINGAN</Label>
                  <Input
                    id="sesiBimbingan"
                    placeholder="Sesi bimbingan..."
                    value={sesiBimbingan}
                    onChange={(e) => setSesiBimbingan(e.target.value)}
                    className="h-12 bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Completion Progress</span>
                  <span className="text-sm text-muted-foreground">{completionProgress.completed}/{completionProgress.total} Standards</span>
                </div>
                <Progress value={completionProgress.percentage} className="h-2" />
              </div>

              {/* Auto-clone from last visit button */}
              {schoolId && (
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to copy data from the last visit to this school? This will overwrite current form data."
                      );
                      if (confirmed) {
                        handleAutoCloneFromLastVisit();
                      }
                    }}
                    className="w-full"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Copy from Last Visit to This School
                  </Button>
                </div>
              )}

              {/* Image Upload Section */}
              <div className="pt-6 border-t border-border/30">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5 text-primary" />
                  <Label className="text-lg font-semibold text-foreground">Proof Images</Label>
                </div>
                <ImageUpload
                  visitId={currentVisitId}
                  ensureVisitId={async () => {
                    // Create a draft visit on-demand so images can be uploaded first
                    const { data: user } = await supabase.auth.getUser();
                    const officerId = user.user?.id;
                    if (!officerId || !schoolId) {
                      alert('Please select a school and fill officer first.');
                      return '';
                    }
                    // If already created during another upload, reuse
                    if (currentVisitId) return currentVisitId;
                    const { data: visit, error } = await supabase
                      .from('visits')
                      .insert({
                        school_id: schoolId,
                        officer_id: officerId,
                        visit_date: visitDate || undefined,
                        status: 'draft',
                        officer_name: officer || null,
                        pgb: pgb || null,
                        sesi_bimbingan: sesiBimbingan || null
                      })
                      .select('id')
                      .single();
                    if (error) { alert(error.message); return ''; }
                    setCurrentVisitId(visit.id as string);
                    return visit.id as string;
                  }}
                  existingImages={visitImages}
                  onImageUploaded={(imageData) => {
                    setVisitImages(prev => [...prev, imageData]);
                  }}
                  onImageRemoved={(imageId) => {
                    setVisitImages(prev => prev.filter(img => img.id !== imageId));
                  }}
                />
              </div>
              
              {/* Actions moved to bottom Action Buttons card */}
            </CardContent>
          </Card>

          {/* Standards Assessment */}
          <Card className="gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">Standards Assessment</CardTitle>
              <p className="text-muted-foreground">Complete each standard to generate the official borang PDF.</p>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full space-y-4">
                {standards.map((standard) => (
                  <AccordionItem 
                    key={standard.id} 
                    value={standard.id}
                    className="border border-border/50 rounded-lg px-6 py-2 bg-background/30"
                  >
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-12 h-12 rounded-lg ${standard.color} flex items-center justify-center shadow-sm`}>
                          <standard.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-foreground">{standard.code}</h3>
                            <Badge 
                              variant={getStandardStatus(standard.code.split(' ')[1]) === 'In Progress' ? 'default' : 'outline'} 
                              className={`text-xs ${
                                getStandardStatus(standard.code.split(' ')[1]) === 'In Progress' 
                                  ? 'bg-green-500 text-white border-green-500' 
                                  : ''
                              }`}
                            >
                              {getStandardStatus(standard.code.split(' ')[1])}
                            </Badge>
                          </div>
                          <p className="text-base font-medium text-foreground mb-1">{standard.title}</p>
                          <p className="text-sm text-muted-foreground">{standard.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 pb-6">
                      <div className="space-y-6">
                        {/* Page Title */}
                        {(() => {
                          const code = standard.code.split(' ')[1] as any;
                          const page = currentPageSchema(code);
                          if (!page?.title) return null;
                          
                          // Parse title into main title and subtitle
                          const titleParts = page.title.split(' ');
                          let mainTitle = '';
                          let subtitle = '';
                          
                          // Find the split point (after "ASPEK X.X:")
                          const aspectIndex = titleParts.findIndex(part => part === 'ASPEK');
                          if (aspectIndex !== -1) {
                            // Find the colon after the aspect number
                            const colonIndex = titleParts.findIndex((part, idx) => 
                              idx > aspectIndex && part.includes(':')
                            );
                            
                            if (colonIndex !== -1) {
                              // Find the subtitle starting with the specific point number (e.g., "2.1.1" or "3.1.1.1")
                              const subtitleStartIndex = titleParts.findIndex((part, idx) => 
                                idx > colonIndex && /^\d+\.\d+\.\d+(\.\d+)?$/.test(part)
                              );
                              
                              if (subtitleStartIndex !== -1) {
                                // Main title: "ASPEK X.X: [DESCRIPTION]" (everything up to subtitle)
                                mainTitle = titleParts.slice(0, subtitleStartIndex).join(' ');
                                // Subtitle: from the specific point number onwards
                                subtitle = titleParts.slice(subtitleStartIndex).join(' ');
                              } else {
                                // Fallback: everything after the colon
                                mainTitle = titleParts.slice(0, colonIndex + 1).join(' ');
                                subtitle = titleParts.slice(colonIndex + 1).join(' ');
                              }
                            }
                          }
                          
                          // Fallback if parsing fails
                          if (!mainTitle || !subtitle) {
                            mainTitle = page.title;
                            subtitle = '';
                          }
                          
                          return (
                            <div className="mb-6">
                              <h2 className="text-xl font-semibold text-foreground leading-tight border-b-2 border-primary/20 pb-3">
                                {mainTitle}
                              </h2>
                              {subtitle && (
                                <h3 className="text-lg font-medium text-foreground/80 leading-tight mt-2">
                                  {subtitle}
                                </h3>
                              )}
                            </div>
                          );
                        })()}

                        {/* PLAN Section - Information List */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground text-lg border-b pb-2">PLAN</h4>
                          <div className="space-y-3 p-4 bg-blue-50/30 rounded-lg border border-blue-200/30">
                            {(() => {
                              const code = standard.code.split(' ')[1] as any;
                              const page = currentPageSchema(code);
                              const planItems = page?.plan || [];
                              return planItems.length > 0 ? (
                                <ul className="space-y-2">
                                  {planItems.map((item, idx) => {
                                    // Transform the plan item to add newlines before a), b), c), etc.
                                    const formattedItem = item.replace(/\s+([a-z]\))/gi, '\n$1');
                                    return (
                                      <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="text-blue-600 font-medium">•</span>
                                        <span className="whitespace-pre-line">{formattedItem}</span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <p className="text-muted-foreground text-sm">No plan items available</p>
                              );
                            })()}
                          </div>
                        </div>

                        {/* DO Section - Editable Text Box with Suggestions */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h4 className="font-medium text-foreground text-lg">DO</h4>
                            {(() => {
                              const code = standard.code.split(' ')[1] as any;
                              const pageCode = currentPageCode(code);
                              const pageKey = `${code}-${pageCode}`;
                              const isAutoFilled = autoFilledFields[pageKey]?.has('doText');
                              return isAutoFilled ? <AutoFilledBadge /> : null;
                            })()}
                          </div>
                          <div className="space-y-3">
                            <Label className="text-sm text-muted-foreground">Implementation Details</Label>
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Enter implementation details..."
                                value={(() => {
                                  const code = standard.code.split(' ')[1] as any;
                                  const pageCode = currentPageCode(code);
                                  const pageKey = `${code}-${pageCode}`;
                                  return localSections[pageKey]?.doText || '';
                                })()}
                                onChange={(e) => {
                                  const code = standard.code.split(' ')[1] as any;
                                  const pageCode = currentPageCode(code);
                                  const pageKey = `${code}-${pageCode}`;
                                  setLocalSections(prev => ({
                                    ...prev,
                                    [pageKey]: {
                                      ...prev[pageKey],
                                      doText: e.target.value
                                    }
                                  }));
                                }}
                                className="min-h-20 bg-background/50 border-border/50 focus:border-primary resize-none"
                              />
                              {/* Dropdown Suggestions */}
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Quick Suggestions (click to add)</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {(() => {
                                    const code = standard.code.split(' ')[1] as any;
                                    const page = currentPageSchema(code);
                                    const suggestions = page?.do?.suggestions || [];
                                    return suggestions.map((suggestion, idx) => (
                                      <Button 
                                        key={idx} 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => {
                                          const code = standard.code.split(' ')[1] as any;
                                          const pageCode = currentPageCode(code);
                                          const pageKey = `${code}-${pageCode}`;
                                          const currentText = localSections[pageKey]?.doText || '';
                                          const separator = currentText ? '\n' : '';
                                          setLocalSections(prev => ({
                                            ...prev,
                                            [pageKey]: {
                                              ...prev[pageKey],
                                              doText: currentText + separator + suggestion
                                            }
                                          }));
                                        }}
                                        className="text-xs h-auto min-h-8 px-3 py-2 text-left whitespace-normal break-words"
                                      >
                                        {suggestion}
                                      </Button>
                                    ));
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CHECK Section - Information and Checkboxes */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-foreground text-lg border-b pb-2">CHECK</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Assessment Criteria - Left Side */}
                            <div className="space-y-3">
                              <Label className="text-sm text-muted-foreground">Assessment Criteria</Label>
                              <div className="space-y-2 p-3 bg-green-50/30 rounded-lg border border-green-200/30">
                                {(() => {
                                  const code = standard.code.split(' ')[1] as any;
                                  const page = currentPageSchema(code);
                                  const criteria = page?.check?.criteria || [];
                                  return criteria.length > 0 ? (
                                    <ul className="space-y-1">
                                      {criteria.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs">
                                          <span className="text-green-600 font-medium">{idx + 1}.</span>
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-muted-foreground text-xs">No assessment criteria</p>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* Assessment Results - Right Side */}
                            <div className="space-y-3">
                              <Label className="text-sm text-muted-foreground">Assessment Results</Label>
                              <div className="space-y-2 p-3 bg-yellow-50/30 rounded-lg border border-yellow-200/30">
                                {(() => {
                                  const code = standard.code.split(' ')[1] as any;
                                  const page = currentPageSchema(code);
                                  const checkboxes = page?.check?.checkboxes || [];
                                  const pageCode = currentPageCode(code);
                                  const pageKey = `${code}-${pageCode}`;
                                  const evidences = localSections[pageKey]?.evidences || Array(checkboxes.length).fill(false);
                                  return checkboxes.length > 0 ? (
                                    <div className="space-y-2">
                                      {checkboxes.map((option, idx) => (
                                        <label key={idx} className="flex items-center gap-2 text-xs">
                                          <input
                                            type="checkbox"
                                            className="rounded border-border"
                                            checked={evidences[idx] || false}
                                            onChange={(e) => {
                                              setLocalSections(prev => {
                                                const currentSection = prev[pageKey];
                                                const newEvidences = [...(currentSection?.evidences || Array(checkboxes.length).fill(false))];
                                                newEvidences[idx] = e.target.checked;
                                                return {
                                                  ...prev,
                                                  [pageKey]: {
                                                    ...currentSection,
                                                    evidences: newEvidences
                                                  }
                                                };
                                              });
                                            }}
                                          />
                                          <span>{option}</span>
                                        </label>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-muted-foreground text-xs">No assessment options</p>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ACT Section - Editable Text Box with Suggestions */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h4 className="font-medium text-foreground text-lg">ACT</h4>
                            {(() => {
                              const code = standard.code.split(' ')[1] as any;
                              const pageCode = currentPageCode(code);
                              const pageKey = `${code}-${pageCode}`;
                              const isAutoFilled = autoFilledFields[pageKey]?.has('actText');
                              return isAutoFilled ? <AutoFilledBadge /> : null;
                            })()}
                          </div>
                          <div className="space-y-3">
                            <Label className="text-sm text-muted-foreground">Follow-up Actions</Label>
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Enter follow-up actions..."
                                value={(() => {
                                  const code = standard.code.split(' ')[1] as any;
                                  const pageCode = currentPageCode(code);
                                  const pageKey = `${code}-${pageCode}`;
                                  return localSections[pageKey]?.actText || '';
                                })()}
                                onChange={(e) => {
                                  const code = standard.code.split(' ')[1] as any;
                                  const pageCode = currentPageCode(code);
                                  const pageKey = `${code}-${pageCode}`;
                                  setLocalSections(prev => ({
                                    ...prev,
                                    [pageKey]: {
                                      ...prev[pageKey],
                                      actText: e.target.value
                                    }
                                  }));
                                }}
                                className="min-h-20 bg-background/50 border-border/50 focus:border-primary resize-none"
                              />
                              {/* Dropdown Suggestions */}
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Quick Suggestions (click to add)</Label>
                                <div className="flex flex-wrap gap-2">
                                  {(() => {
                                    const code = standard.code.split(' ')[1] as any;
                                    const page = currentPageSchema(code);
                                    const suggestions = page?.act?.suggestions || [];
                                    return suggestions.map((suggestion, idx) => (
                                      <Button 
                                        key={idx} 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => {
                                          const code = standard.code.split(' ')[1] as any;
                                          const pageCode = currentPageCode(code);
                                          const pageKey = `${code}-${pageCode}`;
                                          const currentText = localSections[pageKey]?.actText || '';
                                          const separator = currentText ? '\n' : '';
                                          setLocalSections(prev => ({
                                            ...prev,
                                            [pageKey]: {
                                              ...prev[pageKey],
                                              actText: currentText + separator + suggestion
                                            }
                                          }));
                                        }}
                                        className="text-xs h-7 px-2"
                                      >
                                        {suggestion}
                                      </Button>
                                    ));
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Evidence Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-2">
                            <h4 className="font-medium text-foreground text-lg">Evidence</h4>
                            {(() => {
                              const code = standard.code.split(' ')[1] as any;
                              const pageCode = currentPageCode(code);
                              const pageKey = `${code}-${pageCode}`;
                              const isAutoFilled = autoFilledFields[pageKey]?.has('evidences');
                              return isAutoFilled ? <AutoFilledBadge /> : null;
                            })()}
                          </div>
                          <div className="space-y-3 p-4 bg-purple-50/30 rounded-lg border border-purple-200/30">
                            <div className="space-y-2">
                              {(() => {
                                const code = standard.code.split(' ')[1] as any;
                                const page = currentPageSchema(code);
                                const pageCode = currentPageCode(code);
                                const pageKey = `${code}-${pageCode}`;
                                
                                // Use page-specific evidence storage
                                const pageState = localSections[pageKey];
                                const evidences = pageState?.evidences || Array(page?.evidenceLabels?.length || 0).fill(false);
                                const labels = page?.evidenceLabels || evidences.map((_,i)=>`Evidence ${i+1}`);
                                
                                return labels.map((label, idx) => {
                                  // Check if this is the "Lain-lain" field
                                  const isLainLain = label.toLowerCase().includes('lain');
                                   
                                  return (
                                    <div key={idx} className="flex items-center gap-2">
                                      {isLainLain ? (
                                        // Input field for "Lain-lain"
                                        <div className="flex-1 flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            className="rounded border-border"
                                            checked={evidences[idx] || false}
                                            onChange={(e) => {
                                              setLocalSections((prev) => {
                                                const currentSection = prev[pageKey];
                                                const newEvidences = [...(currentSection?.evidences || Array(labels.length).fill(false))];
                                                newEvidences[idx] = e.target.checked;
                                                return {
                                                  ...prev,
                                                  [pageKey]: {
                                                    ...currentSection,
                                                    evidences: newEvidences
                                                  }
                                                };
                                              });
                                            }}
                                          />
                                          <span className="text-sm">{label.split('_')[0]}</span>
                                          <Input
                                            placeholder="Enter details..."
                                            className="flex-1 h-8 text-xs bg-background/50 border-border/50"
                                            disabled={!evidences[idx]}
                                            value={pageState?.lainLainText || ''}
                                            onChange={(e) => {
                                              setLocalSections((prev) => {
                                                const currentSection = prev[pageKey];
                                                return {
                                                  ...prev,
                                                  [pageKey]: {
                                                    ...currentSection,
                                                    lainLainText: e.target.value
                                                  }
                                                };
                                              });
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        // Regular checkbox
                                        <label className="flex items-center gap-2 text-sm">
                                          <input
                                            type="checkbox"
                                            className="rounded border-border"
                                            checked={evidences[idx] || false}
                                            onChange={(e) => {
                                              setLocalSections((prev) => {
                                                const currentSection = prev[pageKey];
                                                const newEvidences = [...(currentSection?.evidences || Array(labels.length).fill(false))];
                                                newEvidences[idx] = e.target.checked;
                                                return {
                                                  ...prev,
                                                  [pageKey]: {
                                                    ...currentSection,
                                                    evidences: newEvidences
                                                  }
                                                };
                                              });
                                            }}
                                          />
                                          <span>{label}</span>
                                        </label>
                                      )}
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Auto-Fill Section */}
                        <div className="space-y-4 pt-6 border-t border-border/30">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground text-lg">Auto-Fill Options</h4>
                            <Copy className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="p-4 bg-blue-50/30 rounded-lg border border-blue-200/30">
                            <p className="text-sm text-muted-foreground mb-3">
                              After filling in this assessment, you can auto-fill the rest of Standard {standard.code.split(' ')[1]} with the same data. 
                              <strong className="text-orange-600">This will overwrite existing data in other pages.</strong>
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const confirmed = window.confirm(
                                  `Are you sure you want to auto-fill all pages in Standard ${standard.code.split(' ')[1]} with the current data? This action cannot be undone.`
                                );
                                if (confirmed) {
                                  handleAutoCloneWithinStandard(standard.code.split(' ')[1]);
                                }
                              }}
                              className="w-full"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Auto-Fill Rest of Standard {standard.code.split(' ')[1]}
                            </Button>
                          </div>
                        </div>

                        {/* Page navigation for sub-forms in each standard */}
                        <div className="flex items-center justify-between pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setPageIndex((p) => ({ ...p, [standard.code.split(' ')[1] as any]: Math.max(0, (p[standard.code.split(' ')[1] as any] ?? 0) - 1) }))}
                          >
                            Prev
                          </Button>
                          <div className="text-sm text-muted-foreground">
                            {(() => { 
                              const std = standard.code.split(' ')[1] as any; 
                              return `Page ${(pageIndex[std]??0)+1} / ${(standardPages[std]?.length ?? 1)}`; 
                            })()}
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setPageIndex((p) => {
                              const key = standard.code.split(' ')[1] as any;
                              const len = standardPages[key]?.length ?? 1;
                              return { ...p, [key]: Math.min(len - 1, (p[key] ?? 0) + 1) };
                            })}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="gradient-card shadow-soft border-0">
            <CardContent className="py-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="outline" size="lg" className="px-8 py-6 hover:bg-primary hover:text-primary-foreground transition-all duration-200" onClick={() => saveMutation.mutate()} disabled={!schoolId || !officer || officer.trim().length === 0 || saveMutation.isPending}>
                  <Save className="w-5 h-5 mr-3" />
                   {saveMutation.isPending ? 'Saving...' : 'Save Progress'}
                </Button>
                <Button size="lg" variant="secondary" className="px-8 py-6 hover:bg-primary hover:text-primary-foreground transition-all duration-200" onClick={handleDownloadReport}>
                  <Download className="w-5 h-5 mr-3" />
                  Download Report
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 hover:bg-primary hover:text-primary-foreground transition-all duration-200" 
                  onClick={() => {
                    // Reset form and redirect to history
                    setLocalSections({});
                    setVisitImages([]);
                    setCurrentVisitId(undefined);
                    setIsDraftCreated(false);
                    setAutoFilledFields({});
                    setSchoolId('');
                    setVisitDate('');
                    setOfficer('');
                    setPgb('');
                    setSesiBimbingan('');
                    setPageIndex({});
                    toast({ title: "Form completed", description: "Redirecting to history page" });
                    // Use React Router navigation instead of window.location
                    navigate('/history');
                  }}
                >
                  <Check className="w-5 h-5 mr-3" />
                  Complete & View History
                </Button>
              </div>
              
              {/* Additional Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 pt-6 border-t border-border/30">
                <Button variant="outline" size="lg" className="px-6 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-200" onClick={() => {
                  // Reset form
                  setLocalSections({});
                  setVisitImages([]);
                  setCurrentVisitId(undefined);
                  setIsDraftCreated(false);
                  setAutoFilledFields({});
                  setSchoolId('');
                  setVisitDate('');
                  setOfficer('');
                  setPgb('');
                  setSesiBimbingan('');
                  setPageIndex({});
                  toast({ title: "Form reset", description: "All data has been cleared" });
                }}>
                  <RotateCcw className="w-5 h-5 mr-3" />
                  Reset Form
                </Button>
                <Button size="lg" variant="outline" className="px-6 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-200" onClick={() => {
                  // Navigate to new visit
                  navigate('/visits/new');
                }}>
                  <Plus className="w-5 h-4 mr-3" />
                  New Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Auto-clone Modal */}
      <AutoCloneModal
        isOpen={showAutoCloneModal}
        onClose={() => setShowAutoCloneModal(false)}
        onConfirm={() => {
          if (autoCloneType === 'within-standard') {
            executeAutoCloneWithinStandard();
          } else {
            executeAutoCloneFromLastVisit();
          }
        }}
        type={autoCloneType}
        standardCode={autoCloneStandard}
        schoolName={schools?.find(s => s.id === schoolId)?.name}
      />
    </main>
  );
};

export default VisitForm;
