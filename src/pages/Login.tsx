import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
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
    if (!email.trim() || !password.trim()) {
      toast({ 
        title: "Missing information", 
        description: "Please enter both email and password.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      setLoading(true);
      
      // First check if user registration is approved
      const { data: registrationData } = await supabase
        .from('user_registrations')
        .select('status, admin_notes')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (registrationData) {
        if (registrationData.status === 'pending') {
          toast({ 
            title: "Account Pending Approval", 
            description: "Your registration is still being reviewed by an administrator. You'll receive an email once approved.", 
            variant: "destructive" 
          });
          setLoading(false);
          return;
        }
        
        if (registrationData.status === 'rejected') {
          toast({ 
            title: "Account Rejected", 
            description: `Your registration was not approved. ${registrationData.admin_notes ? `Reason: ${registrationData.admin_notes}` : 'Please contact administrator for more information.'}`, 
            variant: "destructive" 
          });
          setLoading(false);
          return;
        }
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({ 
            title: "Login failed", 
            description: "Invalid email or password. Please check your credentials and try again.", 
            variant: "destructive" 
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({ 
            title: "Email not confirmed", 
            description: "Please check your email and click the confirmation link before signing in.", 
            variant: "destructive" 
          });
        } else {
          toast({ 
            title: "Login failed", 
            description: error.message, 
            variant: "destructive" 
          });
        }
        return;
      }

      if (data.user) {
        toast({ 
          title: "Welcome back!", 
          description: "Successfully signed in to your account." 
        });
        navigate("/");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      toast({ 
        title: "Login failed", 
        description: "An unexpected error occurred. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

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
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              
              <Button
                onClick={handleLogin}
                className="w-full h-12 gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0 font-medium"
                disabled={loading || !email.trim() || !password.trim()}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">New to SIP+?</p>
                    <p>Register for an account and wait for admin approval before signing in.</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-4 space-y-2">
                <Link to="/signup" className="text-sm text-primary hover:underline inline-block">
                  Don't have an account? Sign up
                </Link>
                <button className="block w-full text-sm text-muted-foreground hover:underline mt-1">
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
