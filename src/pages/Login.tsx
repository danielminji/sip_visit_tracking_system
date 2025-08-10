import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Signed in", description: "Welcome back." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Login failed", description: err?.message ?? "Unexpected error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // OAuth providers are not configured in this project. Keeping email/password only.

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Login • SIP+ School Visit Tracking"
        description="Secure login to the SIP+ School Visit Tracking system for authorized officers to manage school visits and generate official borang PDFs."
      />
      
      <div className="absolute inset-0 gradient-hero opacity-5"></div>
      
      <section className="container mx-auto px-4 py-24 flex items-center justify-center relative">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your SIP+ dashboard</p>
          </div>
          
          <Card className="gradient-card shadow-soft border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">Officer Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="officer@sip.edu.my"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                />
              </div>
              
              <Button
                onClick={handleLogin}
                className="w-full h-12 gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0 font-medium"
                disabled={loading || !email || !password}
              >
                {loading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              
              <div className="text-center pt-4 space-y-2">
                <p className="text-sm text-muted-foreground">Use your SIP+ account credentials</p>
                <Link to="/signup" className="text-sm text-primary hover:underline inline-block">
                  Don’t have an account? Sign up
                </Link>
                <button className="block w-full text-sm text-muted-foreground hover:underline mt-1" onClick={() => navigate('/login') }>
                  Forgot your password?
                </button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Need access? Contact your system administrator
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
