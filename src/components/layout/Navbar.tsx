import { Link, useNavigate } from "react-router-dom";
import { Building2, Clock, LogIn, LogOut, Plus, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { session, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const authed = !!session;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Failed to logout. Please try again.');
      } else {
        // The onAuthStateChange listener will handle state updates.
        // We just need to navigate.
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error('An unexpected error occurred during logout.');
    } finally {
      setIsLoggingOut(false);
      setMobileMenuOpen(false); // Close mobile menu if open
    }
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
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Link to="/schools" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <Building2 className="w-4 h-4 group-hover:text-primary transition-colors" />
              Schools
            </Link>
            <Link to="/history" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <Clock className="w-4 h-4 group-hover:text-primary transition-colors" />
              History
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <Shield className="w-4 h-4 group-hover:text-primary transition-colors" />
                Admin
              </Link>
            )}
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
              <Button 
                onClick={handleLogout} 
                variant="ghost" 
                size="sm" 
                disabled={isLoggingOut}
                className="text-muted-foreground hover:text-foreground"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/visits/new">
            <Button size="sm" className="gradient-primary hover:shadow-glow transition-all duration-300 border-0">
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link 
              to="/schools" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building2 className="w-4 h-4" />
              Schools
            </Link>
            <Link 
              to="/history" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Clock className="w-4 h-4" />
              History
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            {!authed ? (
              <Link 
                to="/login" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            ) : (
              <button 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoggingOut}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 w-full text-left disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
