import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageGallery } from "@/components/ui/image-gallery";
import { Clock, Search, Calendar, User, Eye, Download, Filter, Camera, Edit, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { generateVisitReportPdf } from "@/pdf/report";
import { standardsConfig } from "@/standards/config";
import { toast } from "@/components/ui/use-toast";

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
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  
  const { data } = useQuery({
    queryKey: ["visits","list"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [] as any[];
      const { data, error } = await supabase
        .from("visits")
        .select("id, visit_date, status, officer_name, pgb, sesi_bimbingan, schools(name), profiles:profiles!visits_officer_id_fkey(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Load images when gallery is opened
  const { data: selectedVisitImages } = useQuery({
    queryKey: ["visit-images", selectedVisitId],
    queryFn: async () => {
      if (!selectedVisitId) return [];
      return await fetchVisitImages(selectedVisitId);
    },
    enabled: !!selectedVisitId && showImageGallery,
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

  // Fetch page data directly from visit_pages to ensure complete results under RLS
  const fetchPagesForVisit = async (visitId: string) => {
    const { data, error } = await supabase
      .from('visit_pages')
      .select('standard_code,page_code,data')
      .eq('visit_id', visitId);
    if (error) throw error;
    return data ?? [];
  };

  // Fallback: when detailed page rows are not present, synthesize pages from visit_sections summaries
  const fetchFallbackSectionsAsPages = async (visitId: string) => {
    const { data, error } = await supabase
      .from('visit_sections')
      .select('section_code, score, evidences, remarks')
      .eq('visit_id', visitId);
    if (error) return [] as any[];

    const rows: any[] = [];
    for (const summary of data || []) {
      const std = summary.section_code as keyof typeof standardsConfig;
      const stdCfg = standardsConfig[std];
      if (!stdCfg) continue;
      for (const page of stdCfg.pages || []) {
        rows.push({
          standard_code: std,
          page_code: page.code,
          data: {
            score: summary.score ?? null,
            evidences: Array.isArray(summary.evidences) ? summary.evidences : [],
            remarks: summary.remarks ?? '',
          }
        });
      }
    }
    return rows;
  };

  // Function to view visit details
  const handleViewVisit = async (visit: any) => {
    try {
      // Fetch detailed page rows; if none, fall back to synthesizing from visit_sections
      let pageRows = await fetchPagesForVisit(visit.id);
      if (!pageRows || pageRows.length === 0) {
        pageRows = await fetchFallbackSectionsAsPages(visit.id);
      }
      const { generateVisitReportPdf, buildReportSectionsFromState } = await import('@/pdf/report');

      const localSections: any = {};
      for (const pageRow of pageRows || []) {
        const pageKey = `${pageRow.standard_code}-${pageRow.page_code}`;
        localSections[pageKey] = {
          code: pageKey,
          standardCode: pageRow.standard_code,
          pageCode: pageRow.page_code,
          score: pageRow.data?.score ?? undefined,
          evidences: pageRow.data?.evidences ?? [],
          remarks: pageRow.data?.remarks ?? '',
          doText: pageRow.data?.doText ?? '',
          actText: pageRow.data?.actText ?? '',
          lainLainText: pageRow.data?.lainLainText ?? ''
        };
      }

      const sections = buildReportSectionsFromState(localSections, {});
      const images = await fetchVisitImages(visit.id);

      const blob = await generateVisitReportPdf({
        schoolName: visit.schools?.name ?? '',
        visitDate: visit.visit_date,
        officerName: visit.officer_name,
        pgb: visit.pgb,
        sesiBimbingan: visit.sesi_bimbingan,
        sections,
        images
      });

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: any) {
      toast({ title: 'View failed', description: error?.message ?? 'Unexpected error', variant: 'destructive' });
    }
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/50">
                      <TableHead className="font-semibold text-foreground min-w-[120px]">Date</TableHead>
                      <TableHead className="font-semibold text-foreground min-w-[200px]">School</TableHead>
                      <TableHead className="font-semibold text-foreground min-w-[150px]">Officer</TableHead>
                      <TableHead className="font-semibold text-foreground min-w-[120px]">Status</TableHead>
                      <TableHead className="font-semibold text-foreground min-w-[100px]">Images</TableHead>
                      <TableHead className="font-semibold text-foreground text-right min-w-[300px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
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
                        <TableRow key={v.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium">{new Date(v.visit_date).toLocaleDateString()}</TableCell>
                          <TableCell>{v.schools?.name ?? 'Unknown School'}</TableCell>
                          <TableCell>{v.officer_name ?? 'Unknown Officer'}</TableCell>
                          <TableCell>
                            <Badge variant={v.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                              {v.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {/* Use live indicator so count is accurate */}
                            <VisitImagesIndicator visitId={v.id} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col sm:flex-row justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewVisit(v)}>
                                <Eye className="w-4 h-4 mr-2" /> View
                              </Button>
                              <Button size="sm" variant="outline" className="ml-2" onClick={async () => {
                                try {
                                  toast({ title: "Generating PDF...", description: "Please wait while we prepare your report." });

                                  // Fetch detailed page rows; if none, fall back from summaries
                                  let pageRows = await fetchPagesForVisit(v.id);
                                  if (!pageRows || pageRows.length === 0) {
                                    pageRows = await fetchFallbackSectionsAsPages(v.id);
                                  }

                                  // Convert page data to localSections format (same as VisitForm)
                                  const localSections: any = {};
                                  for (const pageRow of pageRows || []) {
                                    const pageKey = `${pageRow.standard_code}-${pageRow.page_code}`;
                                    localSections[pageKey] = {
                                      code: pageKey,
                                      standardCode: pageRow.standard_code,
                                      pageCode: pageRow.page_code,
                                      score: pageRow.data?.score ?? undefined,
                                      evidences: pageRow.data?.evidences ?? [],
                                      remarks: pageRow.data?.remarks ?? '',
                                      doText: pageRow.data?.doText ?? '',
                                      actText: pageRow.data?.actText ?? '',
                                      lainLainText: pageRow.data?.lainLainText ?? ''
                                    };
                                  }

                                  const { generateVisitReportPdf, buildReportSectionsFromState } = await import('@/pdf/report');
                                  const sections = buildReportSectionsFromState(localSections, {});
                                  const images = await fetchVisitImages(v.id);

                                  const blob = await generateVisitReportPdf({
                                    schoolName: v.schools?.name ?? '',
                                    visitDate: v.visit_date,
                                    officerName: v.officer_name,
                                    pgb: v.pgb,
                                    sesiBimbingan: v.sesi_bimbingan,
                                    sections,
                                    images
                                  });

                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url; a.download = 'visit-report.pdf'; a.click(); URL.revokeObjectURL(url);

                                  toast({ title: "✅ Report downloaded successfully!", description: "Visit report has been downloaded successfully.", duration: 3000, className: "bg-green-50 border-green-200 text-green-800" });
                                } catch (error: any) {
                                  toast({ title: 'Report failed', description: error?.message ?? 'Unexpected error', variant: 'destructive' });
                                }
                              }}>
                                <Download className="w-4 h-4 mr-3" /> Report
                              </Button>
                              <Button size="sm" variant="outline" className="ml-2" onClick={() => {
                                // Navigate to edit form with visit data
                                navigate(`/visits/edit/${v.id}`);
                              }}>
                                <Edit className="w-4 h-4 mr-2" /> Edit
                              </Button>
                              <Button size="sm" variant="outline" className="ml-2" onClick={() => {
                                setSelectedVisitId(v.id);
                                setShowImageGallery(true);
                              }}>
                                <ImageIcon className="w-4 h-4 mr-2" /> Gallery
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
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
      
      {/* Image Gallery Modal */}
      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visit Images</DialogTitle>
          </DialogHeader>
      <ImageGallery
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        images={selectedVisitImages || []}
      />
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default History;
