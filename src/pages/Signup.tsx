import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, UserPlus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const cleanedEmail = email.trim().toLowerCase();
    const allowedDomains = (import.meta.env.VITE_ALLOWED_SIGNUP_DOMAINS as string | undefined)?.split(',').map(d => d.trim().toLowerCase()).filter(Boolean);

    if (!/.+@.+\..+/.test(cleanedEmail)) {
      toast({ title: "Invalid email", description: "Enter a valid email address.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (allowedDomains && allowedDomains.length > 0) {
      const domain = cleanedEmail.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        toast({ title: "Email domain not allowed", description: `Use your work email (${allowedDomains.join(', ')}) or contact admin.`, variant: "destructive" });
        return;
      }
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: cleanedEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      if (data.session) {
        toast({ title: "Account created", description: "You are now signed in." });
        navigate("/");
      } else {
        toast({ title: "Check your email", description: "We sent a confirmation link to complete sign up." });
        navigate("/login");
      }
    } catch (err: any) {
      const msg: string = err?.message ?? "Unexpected error";
      let description = msg;
      if (/invalid/i.test(msg)) description = "Email is not allowed by the current Supabase settings. Contact admin or use an approved domain.";
      if (/signups.*not.*allowed/i.test(msg)) description = "Sign ups are disabled. Contact admin to create your account.";
      toast({ title: "Sign up failed", description, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Sign Up • SIP+ School Visit Tracking"
        description="Create an account to access the SIP+ School Visit Tracking system."
      />

      <div className="absolute inset-0 gradient-hero opacity-5"></div>

      <section className="container mx-auto px-4 py-24 flex items-center justify-center relative">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Create your account</h1>
            <p className="text-muted-foreground">Sign up with your work email</p>
          </div>

          <Card className="gradient-card shadow-soft border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">Officer Sign Up</CardTitle>
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

              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Confirm Password
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                />
              </div>

              <Button
                onClick={handleSignup}
                className="w-full h-12 gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0 font-medium"
                disabled={loading || !email || !password || !confirm}
              >
                {loading ? "Creating..." : "Create Account"}
                <UserPlus className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center">
                  Already have an account? Log in
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Signup;


