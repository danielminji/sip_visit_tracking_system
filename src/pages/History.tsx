import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Search, Calendar, User, Eye, Download, Filter, Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { generateBorangPdf } from "@/pdf/generator";

// Component to show image count for a visit
const VisitImagesIndicator = ({ visitId }: { visitId: string }) => {
  const { data: images } = useQuery({
    queryKey: ["visit-images", visitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visit_images')
        .select('id')
        .eq('visit_id', visitId);
      if (error) return [];
      return data || [];
    },
  });

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Camera className="w-4 h-4" />
        <span className="text-sm">0</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-primary">
      <Camera className="w-4 h-4" />
      <span className="text-sm font-medium">{images.length}</span>
    </div>
  );
};

const History = () => {
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["visits","list"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [] as any[];
      const { data, error } = await supabase
        .from("visits")
        .select("id, visit_date, status, schools(name), profiles:profiles!visits_officer_id_fkey(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Function to fetch images for a specific visit
  const fetchVisitImages = async (visitId: string) => {
    const { data: images, error } = await supabase
      .from('visit_images')
      .select('*')
      .eq('visit_id', visitId)
      .order('uploaded_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }
    
    // Add public URLs to images
    const imagesWithUrls = (images || []).map(img => ({
      ...img,
      public_url: supabase.storage
        .from('visit-images')
        .getPublicUrl(img.filename).data.publicUrl
    }));
    
    return imagesWithUrls;
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return data ?? [];
    return (data ?? []).filter((v: any) => (v.schools?.name ?? '').toLowerCase().includes(q));
  }, [data, search]);
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Visit History • SIP+ Visit Tracking"
        description="View and manage your complete SIP+ school visit history. Filter by school, date range, and officer. Access and regenerate official borang PDFs."
      />
      
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">Visit History</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access your complete visit records, filter by date ranges, and regenerate official borang PDFs.
          </p>
        </div>
        
        <Card className="gradient-card shadow-soft border-0 animate-slide-up">
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-semibold text-foreground">All Visits</CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                 <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                   <Input
                    placeholder="Search by school..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary transition-colors"
                   />
                </div>
                <Button variant="outline" className="h-11 px-4">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/50">
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">School</TableHead>
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Officer
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Images</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filtered ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-6 text-muted-foreground">
                          <Clock className="w-16 h-16 opacity-50" />
                          <div className="space-y-2">
                            <p className="text-xl font-medium">No visits recorded yet</p>
                            <p className="text-sm max-w-md">Start a new visit to see it here.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((v: any) => (
                      <TableRow key={v.id}>
                        <TableCell>{v.visit_date}</TableCell>
                        <TableCell>{v.schools?.name ?? '-'}</TableCell>
                        <TableCell>{v.profiles?.name ?? '-'}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                            {v.status ?? 'draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <VisitImagesIndicator visitId={v.id} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={async () => {
                            try {
                              // Build screen-like report from saved data
                              const { data: secRows, error: secErr } = await supabase
                                .from('visit_sections')
                                .select('section_code, score, evidences, remarks')
                                .eq('visit_id', v.id);
                              if (secErr) throw secErr;
                              
                              // Also get the page-specific data (DO, ACT text)
                              const { data: pageRows, error: pageErr } = await supabase
                                .from('visit_pages')
                                .select('standard_code, page_code, data')
                                .eq('visit_id', v.id);
                              if (pageErr) throw pageErr;
                              
                              const { standardsConfig } = await import('@/standards/config');
                              const { generateVisitReportPdf } = await import('@/pdf/report');
                              const secMap: Record<string, any> = {};
                              const pageMap: Record<string, any> = {};
                              
                              (secRows ?? []).forEach((r: any) => { secMap[r.section_code] = r; });
                              (pageRows ?? []).forEach((r: any) => { pageMap[r.standard_code] = r; });
                              
                              const sections = Object.keys(standardsConfig).map((std) => {
                                const cfg = standardsConfig[std];
                                const page = cfg.pages[0];
                                const saved = secMap[std] || {};
                                const pageData = pageMap[std]?.data || {};
                                return {
                                  standardCode: std as any,
                                  pageCode: page.code,
                                  title: page.title,
                                  plan: page.plan ?? [],
                                  doText: pageData.doText || '',
                                  actText: pageData.actText || '',
                                  checklistLabels: page.check?.checkboxes ?? [],
                                  checklistChecked: (saved.evidences ?? []).slice(0, (page.check?.checkboxes ?? []).length),
                                  evidenceLabels: page.evidenceLabels ?? [],
                                  evidenceChecked: (saved.evidences ?? []).slice(0, (page.evidenceLabels ?? []).length),
                                  score: saved.score ?? null,
                                };
                              });
                              
                              // Fetch images for this visit
                              const images = await fetchVisitImages(v.id);
                              const blob = await generateVisitReportPdf({ 
                                schoolName: v.schools?.name ?? '', 
                                visitDate: v.visit_date, 
                                sections,
                                images
                              } as any);
                              const url = URL.createObjectURL(blob);
                              window.open(url, '_blank');
                            } catch (error) {
                              console.error('Error generating report:', error);
                              alert('Error generating report: ' + (error as any)?.message || 'Unknown error');
                            }
                          }}>
                            <Eye className="w-4 h-4 mr-2" /> View
                          </Button>
                          <Button size="sm" variant="secondary" className="ml-2" onClick={async () => {
                            try {
                              // Build screen-like report from saved data
                              const { data: secRows, error: secErr } = await supabase
                                .from('visit_sections')
                                .select('section_code, score, evidences, remarks')
                                .eq('visit_id', v.id);
                              if (secErr) throw secErr;
                              
                              // Also get the page-specific data (DO, ACT text)
                              const { data: pageRows, error: pageErr } = await supabase
                                .from('visit_pages')
                                .select('standard_code, page_code, data')
                                .eq('visit_id', v.id);
                              if (pageErr) throw pageErr;
                              
                              const { standardsConfig } = await import('@/standards/config');
                              const { generateVisitReportPdf } = await import('@/pdf/report');
                              const secMap: Record<string, any> = {};
                              const pageMap: Record<string, any> = {};
                              
                              (secRows ?? []).forEach((r: any) => { secMap[r.section_code] = r; });
                              (pageRows ?? []).forEach((r: any) => { pageMap[r.standard_code] = r; });
                              
                              const sections = Object.keys(standardsConfig).map((std) => {
                                const cfg = standardsConfig[std];
                                const page = cfg.pages[0];
                                const saved = secMap[std] || {};
                                const pageData = pageMap[std]?.data || {};
                                return {
                                  standardCode: std as any,
                                  pageCode: page.code,
                                  title: page.title,
                                  plan: page.plan ?? [],
                                  doText: pageData.doText || '',
                                  actText: pageData.actText || '',
                                  checklistLabels: page.check?.checkboxes ?? [],
                                  checklistChecked: (saved.evidences ?? []).slice(0, (page.check?.checkboxes ?? []).length),
                                  evidenceLabels: page.evidenceLabels ?? [],
                                  evidenceChecked: (saved.evidences ?? []).slice(0, (page.evidenceLabels ?? []).length),
                                  score: saved.score ?? null,
                                };
                              });
                              
                              // Fetch images for this visit
                              const images = await fetchVisitImages(v.id);
                              const blob = await generateVisitReportPdf({ 
                                schoolName: v.schools?.name ?? '', 
                                visitDate: v.visit_date, 
                                sections,
                                images
                              } as any);
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url; a.download = `visit-${v.id}-report.pdf`; a.click(); URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error('Error downloading report:', error);
                              alert('Error downloading report: ' + (error as any)?.message || 'Unknown error');
                            }
                          }}>
                            <Download className="w-4 h-4 mr-2" /> Report
                          </Button>
                          <Button size="sm" className="ml-2 gradient-primary text-white border-0" onClick={async () => {
                            try {
                              // Fetch saved per-section data for this visit
                              const { data: secRows, error: secErr } = await supabase
                                .from('visit_sections')
                                .select('section_code, score, evidences, remarks')
                                .eq('visit_id', v.id);
                              if (secErr) throw secErr;
                              const sections = (secRows ?? []).map((r: any) => ({
                                code: r.section_code,
                                score: r.score,
                                evidences: r.evidences,
                                remarks: r.remarks,
                              }));
                              
                              // Fetch images for this visit
                              const images = await fetchVisitImages(v.id);
                              const blob = await generateBorangPdf({ 
                                schoolName: v.schools?.name ?? '', 
                                visitDate: v.visit_date, 
                                sections,
                                images
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url; a.download = `visit-${v.id}.pdf`; a.click(); URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error('Error generating official PDF:', error);
                              alert('Error generating official PDF: ' + (error as any)?.message || 'Unknown error');
                            }
                          }}>
                            <Download className="w-4 h-4 mr-2" /> Official PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Sample data preview */}
            <div className="mt-8 p-6 bg-muted/20 rounded-lg border border-border/30">
              <h4 className="font-medium text-foreground mb-4">Sample Visit Record (Preview)</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">2025-01-15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">School:</span>
                  <span className="font-medium">SMK Kuantan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Officer:</span>
                  <span className="font-medium">Ahmad bin Hassan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Completed
                  </Badge>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" variant="outline" disabled>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" className="gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default History;
