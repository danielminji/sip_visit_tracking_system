import SEO from "@/components/SEO";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Save, Download, Building2, Calendar, User, Crown, Settings, BookOpen, Trophy, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { sectionCoords, standardPages } from "@/pdf/coordinates";
import { standardsConfig } from "@/standards/config";

const VisitForm = () => {
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

  type LocalSection = { 
    code: '1'|'2'|'3.1'|'3.2'|'3.3'; 
    score?: number|null; 
    evidences: boolean[]; 
    remarks?: string;
    doText?: string;
    actText?: string;
    lainLainText?: string;
  };
  const [localSections, setLocalSections] = useState<Record<string, LocalSection>>({
    '1': { code: '1', evidences: Array(sectionCoords['1'].evidences?.length ?? 0).fill(false), doText: '', actText: '', lainLainText: '' },
    '2': { code: '2', evidences: Array(sectionCoords['2'].evidences?.length ?? 0).fill(false), doText: '', actText: '', lainLainText: '' },
    '3.1': { code: '3.1', evidences: Array(sectionCoords['3.1'].evidences?.length ?? 0).fill(false), doText: '', actText: '', lainLainText: '' },
    '3.2': { code: '3.2', evidences: Array(sectionCoords['3.2'].evidences?.length ?? 0).fill(false), doText: '', actText: '', lainLainText: '' },
    '3.3': { code: '3.3', evidences: Array(sectionCoords['3.3'].evidences?.length ?? 0).fill(false), doText: '', actText: '', lainLainText: '' },
  });

  // page navigation per standard (e.g., 1-2 → 1-3)
  const [pageIndex, setPageIndex] = useState<Record<string, number>>({ '1': 0, '2': 0, '3.1': 0, '3.2': 0, '3.3': 0 });
  // per-page state (doText, checkScore, actText, evidences[])
  const [pagesState, setPagesState] = useState<Record<string, { doText: string; checkScore: number|null; actText: string; evidences: boolean[] }>>({});

  const currentPageCode = (std: string) => standardPages[std]?.[pageIndex[std] ?? 0];
  const currentPageSchema = (std: string) => {
    const cfg = standardsConfig[std];
    const code = currentPageCode(std);
    return cfg.pages.find((p) => p.code === code);
  };

  const progress = useMemo(() => {
    const filled = Object.values(localSections).filter(s => typeof s.score === 'number' || (s.remarks && s.remarks.trim().length > 0)).length;
    return Math.round((filled / 5) * 100);
  }, [localSections]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      const officerId = user.user?.id;
      if (!officerId || !schoolId) throw new Error("Select school first");
      // Ensure a matching profile row exists for FK constraint and save officer name
      await supabase.from('profiles').upsert({ id: officerId, name: officer || null }, { onConflict: 'id' });
      const { data: visit, error } = await supabase
        .from("visits")
        .insert({ school_id: schoolId, officer_id: officerId, visit_date: visitDate || undefined, status: 'draft' })
        .select("id")
        .single();
      if (error) throw error;
      const visitId = visit.id as string;
      for (const s of Object.values(localSections)) {
        await supabase.from('visit_sections').upsert({
          visit_id: visitId,
          section_code: s.code,
          score: s.score ?? null,
          evidences: s.evidences,
          remarks: s.remarks ?? null,
        }, { onConflict: 'visit_id,section_code' });
      }
      // store per-page data as well
      for (const std of Object.keys(pageIndex)) {
        const page = currentPageCode(std);
        if (!page) continue;
        const payload = { visit_id: visitId, standard_code: std as any, page_code: page, data: {
          score: localSections[std]?.score ?? null,
          evidences: localSections[std]?.evidences ?? [],
          remarks: localSections[std]?.remarks ?? '',
          doText: localSections[std]?.doText ?? '',
          actText: localSections[std]?.actText ?? '',
        } } as any;
        await supabase.from('visit_pages').upsert(payload, { onConflict: 'visit_id,page_code' });
      }
      return visitId;
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Visit saved as draft." });
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
    onError: (e: any) => toast({ title: "Save failed", description: e?.message ?? "Unexpected error", variant: "destructive" }),
  });

  const handleGenerate = async () => {
    try {
      const schoolName = (schools ?? []).find(s => s.id === schoolId)?.name ?? '';
      const { generateBorangPdf } = await import('@/pdf/generator');
      const sections = Object.values(localSections);
      const blob = await generateBorangPdf({ schoolName, visitDate, sections } as any);
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'borang.pdf'; a.click(); URL.revokeObjectURL(url);
    } catch (e: any) {
      toast({ title: 'PDF failed', description: e?.message ?? 'Unexpected error', variant: 'destructive' });
    }
  };

  // Build a simple report PDF with the current form state (screen-like summary)
  const handleDownloadReport = async () => {
    try {
      const schoolName = (schools ?? []).find(s => s.id === schoolId)?.name ?? '';
      const { generateVisitReportPdf, buildReportSectionsFromState } = await import('@/pdf/report');
      // build screen-like sections from current state
      const sections = buildReportSectionsFromState(localSections, pageIndex);
      const anyContent = sections.some(s => (s.doText && s.doText.trim()) || (s.actText && s.actText.trim()) || s.checklistChecked.some(Boolean) || s.evidenceChecked.some(Boolean) || typeof s.score === 'number');
      if (!anyContent) {
        toast({ title: 'Nothing to export', description: 'Fill any section to generate a report.' });
        return;
      }
      const blob = await generateVisitReportPdf({ schoolName, visitDate, officerName: officer, pgb, sesiBimbingan, sections } as any);
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'visit-report.pdf'; a.click(); URL.revokeObjectURL(url);
    } catch (e: any) {
      toast({ title: 'Report failed', description: e?.message ?? 'Unexpected error', variant: 'destructive' });
    }
  };

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
                  <Label htmlFor="officer" className="text-sm font-medium text-foreground">Nama Pegawai</Label>
                  <Input
                    id="officer"
                    placeholder="Nama pegawai..."
                    value={officer}
                    onChange={(e) => setOfficer(e.target.value)}
                    className="h-12 bg-background/50 border-border/50 focus:border-primary"
                  />
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
                  <span className="text-sm text-muted-foreground">{Math.round((progress ?? 0)/20)}/5 Standards</span>
                </div>
                <Progress value={progress} className="h-2" />
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
                            <Badge variant="outline" className="text-xs">Not Started</Badge>
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
                          <h4 className="font-medium text-foreground text-lg border-b pb-2">DO</h4>
                          <div className="space-y-3">
                            <Label className="text-sm text-muted-foreground">Implementation Details</Label>
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Enter implementation details..."
                                value={(() => {
                                  const code = standard.code.split(' ')[1] as any;
                                  const page = currentPageSchema(code);
                                  return localSections[code]?.doText || page?.do?.text || '';
                                })()}
                                onChange={(e) => {
                                  const code = standard.code.split(' ')[1] as any;
                                  setLocalSections((prev) => ({
                                    ...prev,
                                    [code]: { ...prev[code], doText: e.target.value },
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
                                    const suggestions = page?.do?.suggestions || [];
                                    return suggestions.map((suggestion, idx) => (
                                      <Button 
                                        key={idx} 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => {
                                          const code = standard.code.split(' ')[1] as any;
                                          const currentText = localSections[code]?.doText || '';
                                          const separator = currentText ? '\n' : '';
                                          setLocalSections((prev) => ({
                                            ...prev,
                                            [code]: { 
                                              ...prev[code], 
                                              doText: currentText + separator + suggestion 
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
                                  const evidences = localSections[code]?.evidences || [];
                                  return checkboxes.length > 0 ? (
                                    <div className="space-y-2">
                                      {checkboxes.map((option, idx) => (
                                        <label key={idx} className="flex items-center gap-2 text-xs">
                                          <input
                                            type="checkbox"
                                            className="rounded border-border"
                                            checked={evidences[idx] || false}
                                            onChange={(e) => {
                                              setLocalSections((prev) => {
                                                const next = { ...prev };
                                                next[code].evidences[idx] = e.target.checked;
                                                return next;
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
                          <h4 className="font-medium text-foreground text-lg border-b pb-2">ACT</h4>
                          <div className="space-y-3">
                            <Label className="text-sm text-muted-foreground">Follow-up Actions</Label>
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Enter follow-up actions..."
                                value={(() => {
                                  const code = standard.code.split(' ')[1] as any;
                                  const page = currentPageSchema(code);
                                  return localSections[code]?.actText || page?.act?.text || '';
                                })()}
                                onChange={(e) => {
                                  const code = standard.code.split(' ')[1] as any;
                                  setLocalSections((prev) => ({
                                    ...prev,
                                    [code]: { ...prev[code], actText: e.target.value },
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
                                          const currentText = localSections[code]?.actText || '';
                                          const separator = currentText ? '\n' : '';
                                          setLocalSections((prev) => ({
                                            ...prev,
                                            [code]: { 
                                              ...prev[code], 
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
                          <h4 className="font-medium text-foreground text-lg border-b pb-2">Evidence</h4>
                          <div className="space-y-3 p-4 bg-purple-50/30 rounded-lg border border-purple-200/30">
                            <div className="space-y-2">
                              {(() => {
                                const code = standard.code.split(' ')[1] as any;
                                const page = currentPageSchema(code);
                                const evidences = localSections[code]?.evidences || [];
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
                                                const next = { ...prev };
                                                next[code].evidences[idx] = e.target.checked;
                                                return next;
                                              });
                                            }}
                                          />
                                          <span className="text-sm">{label.split('_')[0]}</span>
                                          <Input
                                            placeholder="Enter details..."
                                            className="flex-1 h-8 text-xs bg-background/50 border-border/50"
                                            disabled={!evidences[idx]}
                                            value={localSections[code]?.lainLainText || ''}
                                            onChange={(e) => {
                                              setLocalSections((prev) => ({
                                                ...prev,
                                                [code]: { ...prev[code], lainLainText: e.target.value },
                                              }));
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
                                                const next = { ...prev };
                                                next[code].evidences[idx] = e.target.checked;
                                                return next;
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
                 <Button variant="outline" size="lg" className="px-8 py-6" onClick={() => saveMutation.mutate()} disabled={!schoolId || saveMutation.isPending}>
                  <Save className="w-5 h-5 mr-3" />
                   {saveMutation.isPending ? 'Saving...' : 'Save Progress'}
                </Button>
                 <Button size="lg" variant="secondary" className="px-8 py-6" onClick={handleDownloadReport}>
                  <Download className="w-5 h-5 mr-3" />
                  Download Report
                </Button>
                 <Button size="lg" className="gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0 px-8 py-6" onClick={handleGenerate}>
                  <Download className="w-5 h-5 mr-3" />
                  Generate Official PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default VisitForm;
