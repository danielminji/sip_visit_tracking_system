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
      
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">School Directory</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse schools in your district and start new visits with comprehensive school information.
          </p>
        </div>
        
        <Card className="gradient-card shadow-soft border-0 animate-slide-up">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-semibold text-foreground">All Schools</CardTitle>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search schools, categories, or districts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary transition-colors"
                  />
                </div>
                <Button className="gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0" onClick={() => { setEditingId('new'); setDraft({ name: '', category: 'SK', district: 'Raub', address: '', contact: '' }); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  New School
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {editingId === 'new' && (
              <div className="mb-4 p-4 border rounded-lg bg-background/50">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input placeholder="School name" value={draft.name} onChange={(e)=>setDraft((d:any)=>({...d,name:e.target.value}))} />
                  <select className="h-10 border rounded px-2" value={draft.category} onChange={(e)=>setDraft((d:any)=>({...d,category:e.target.value}))}>
                    <option value="SK">SK</option>
                    <option value="SMK">SMK</option>
                  </select>
                  <Input placeholder="District" value={draft.district} onChange={(e)=>setDraft((d:any)=>({...d,district:e.target.value}))} />
                  <Input placeholder="Address" value={draft.address} onChange={(e)=>setDraft((d:any)=>({...d,address:e.target.value}))} />
                  <Input placeholder="Contact" value={draft.contact} onChange={(e)=>setDraft((d:any)=>({...d,contact:e.target.value}))} />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => { upsertMutation.mutate(draft); setEditingId(null); }}>
                    <Save className="w-4 h-4 mr-1" /> Save School
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            )}
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/50">
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        School Name
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        District
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">Address</TableHead>
                    <TableHead className="font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered && filtered.length > 0 ? (
                    filtered.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">
                          {editingId === s.id ? (
                            <div className="flex items-center gap-2">
                              <Input value={draft.name} onChange={(e)=>setDraft((d:any)=>({...d,name:e.target.value}))} className="h-8" />
                              <select className="h-8 border rounded px-2" value={draft.category} onChange={(e)=>setDraft((d:any)=>({...d,category:e.target.value}))}>
                                <option value="SK">SK</option>
                                <option value="SMK">SMK</option>
                              </select>
                            </div>
                          ) : (
                            <>{s.name} <span className="text-xs text-muted-foreground ml-2">({s.category})</span></>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === s.id ? (
                            <Input value={draft.district} onChange={(e)=>setDraft((d:any)=>({...d,district:e.target.value}))} className="h-8" />
                          ) : s.district}
                        </TableCell>
                        <TableCell className="truncate max-w-[320px]">
                          {editingId === s.id ? (
                            <Input value={draft.address ?? ''} onChange={(e)=>setDraft((d:any)=>({...d,address:e.target.value}))} className="h-8" />
                          ) : (s.address ?? '-')}
                        </TableCell>
                        <TableCell>
                          {editingId === s.id ? (
                            <Input value={draft.contact ?? ''} onChange={(e)=>setDraft((d:any)=>({...d,contact:e.target.value}))} className="h-8" />
                          ) : (s.contact ?? '-')}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingId === s.id ? (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => { upsertMutation.mutate({ id: s.id, ...draft }); setEditingId(null); }}>
                                <Save className="w-4 h-4 mr-1" /> Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                <X className="w-4 h-4 mr-1" /> Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setEditingId(s.id); setDraft(s); }}>
                                <Pencil className="w-4 h-4 mr-1" /> Edit
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(s.id)}>
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                              </Button>
                              <Link to="/visits/new">
                                <Button size="sm" className="gradient-primary text-white border-0">
                                  <Plus className="w-4 h-4 mr-2" /> Start Visit
                                </Button>
                              </Link>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          <Building2 className="w-12 h-12 opacity-50" />
                          <div>
                            <p className="text-lg font-medium">No schools found</p>
                            <p className="text-sm">Try a different search or check your database.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
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