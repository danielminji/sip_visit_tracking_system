import { Link, useNavigate } from "react-router-dom";
import { Building2, Clock, LogIn, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [authed, setAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      setAuthed(!!data.session);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-sm font-bold">
            S+
          </div>
          <span className="hidden sm:inline hero-text">SIP+ Tracking</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <Link to="/schools" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <Building2 className="w-4 h-4 group-hover:text-primary transition-colors" />
              Schools
            </Link>
            <Link to="/history" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <Clock className="w-4 h-4 group-hover:text-primary transition-colors" />
              History
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/visits/new">
              <Button className="gradient-primary hover:shadow-glow transition-all duration-300 border-0">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Visit</span>
              </Button>
            </Link>
            {!authed ? (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            ) : (
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
