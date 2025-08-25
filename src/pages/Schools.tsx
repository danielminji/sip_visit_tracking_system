import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Search, MapPin, Phone, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Schools = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { data: schools } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("schools").select("id,name,category,district,address,contact").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<any>({ name: '', category: 'SK', district: 'Raub', address: '', contact: '' });

  const upsertMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from('schools').upsert(payload).select('id').single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schools'] })
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('schools').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schools'] })
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return schools ?? [];
    return (schools ?? []).filter((s) =>
      [s.name, s.category, s.district, s.address ?? "", s.contact ?? ""].some((t) => t?.toLowerCase().includes(q))
    );
  }, [schools, search]);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Schools Directory • SIP+ Visit Tracking"
        description="Browse the comprehensive SIP+ school directory, search by district or name, and start new visits with detailed school information."
      />
      
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">School Directory</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse schools in your district and start new visits with comprehensive school information.
          </p>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">All Schools</CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search schools, categories, or districts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary transition-all touch-manipulation"
                  />
                </div>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 transition-all touch-manipulation" 
                  onClick={() => { 
                    setEditingId('new'); 
                    setDraft({ name: '', category: 'SK', district: 'Raub', address: '', contact: '' }); 
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New School
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {editingId === 'new' && (
              <div className="mb-4 p-4 border rounded-lg bg-background/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input 
                    placeholder="School name" 
                    value={draft.name} 
                    onChange={(e)=>setDraft((d:any)=>({...d,name:e.target.value}))}
                    className="touch-manipulation"
                  />
                  <select 
                    className="h-10 border rounded px-2 touch-manipulation" 
                    value={draft.category} 
                    onChange={(e)=>setDraft((d:any)=>({...d,category:e.target.value}))}
                  >
                    <option value="SK">SK</option>
                    <option value="SMK">SMK</option>
                  </select>
                  <Input 
                    placeholder="District" 
                    value={draft.district} 
                    onChange={(e)=>setDraft((d:any)=>({...d,district:e.target.value}))}
                    className="touch-manipulation"
                  />
                  <Input 
                    placeholder="Contact" 
                    value={draft.contact} 
                    onChange={(e)=>setDraft((d:any)=>({...d,contact:e.target.value}))}
                    className="touch-manipulation"
                  />
                </div>
                <Input 
                  placeholder="Address" 
                  value={draft.address} 
                  onChange={(e)=>setDraft((d:any)=>({...d,address:e.target.value}))}
                  className="mt-3 touch-manipulation"
                />
                <div className="flex gap-2 mt-3">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white transition-all touch-manipulation"
                    onClick={() => {
                      upsertMutation.mutate(draft);
                      setEditingId(null);
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingId(null)}
                    className="touch-manipulation"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {/* Mobile-friendly table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">School</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden lg:table-cell">District</TableHead>
                    <TableHead className="hidden xl:table-cell">Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((school) => (
                    <TableRow key={school.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{school.name}</div>
                          <div className="text-sm text-muted-foreground md:hidden">
                            {school.category} • {school.district}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{school.category}</TableCell>
                      <TableCell className="hidden lg:table-cell">{school.district}</TableCell>
                      <TableCell className="hidden xl:table-cell">{school.contact || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            asChild 
                            size="sm" 
                            variant="outline"
                            className="touch-manipulation"
                          >
                            <Link to={`/visits/new?school=${school.id}`}>
                              <Plus className="w-4 h-4" />
                              <span className="hidden sm:inline ml-1">Visit</span>
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => { setEditingId(school.id); setDraft(school); }}
                            className="touch-manipulation"
                          >
                            <Pencil className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1">Edit</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteMutation.mutate(school.id)}
                            className="text-red-600 hover:text-red-700 touch-manipulation"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Schools;