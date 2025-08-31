import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, UserPlus, ArrowRight, User, Phone, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sendAdminNotification } from "@/lib/emailService";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    const cleanedEmail = formData.email.trim().toLowerCase();

    if (!/.+@.+\..+/.test(cleanedEmail)) {
      toast({ title: "Invalid email", description: "Enter a valid email address.", variant: "destructive" });
      return;
    }
    if (!formData.fullName.trim()) {
      toast({ title: "Full name required", description: "Please enter your full name.", variant: "destructive" });
      return;
    }
    if (formData.password.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    if (formData.password !== formData.confirm) {
      toast({ title: "Passwords do not match", description: "Please ensure your passwords match.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.rpc('create_pending_user', {
        p_full_name: formData.fullName,
        p_email: cleanedEmail,
        p_phone: formData.phone,
        p_password: formData.password
      });

      if (error) {
        throw new Error(error.message);
      }

      await supabase.auth.signOut();

      toast({ 
        title: "Registration Submitted!", 
        description: "Your account is pending admin approval. You will be notified by email once it's approved.",
        duration: 7000,
      });

      sendAdminNotification({
        name: formData.fullName.trim(),
        email: cleanedEmail,
        phone: formData.phone.trim() || undefined
      }).catch(emailError => {
        console.error('Failed to send admin notification:', emailError);
      });

      navigate("/login");

    } catch (err: any) {
      console.error("Signup Error:", err);
      const errorMessage = err.message || "An unexpected error occurred.";
      toast({ 
        title: "Registration Failed", 
        description: errorMessage.includes('already exists') 
          ? 'A user with this email has already registered.' 
          : errorMessage,
        variant: "destructive" 
      });
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
            <p className="text-muted-foreground">Sign up with any email address</p>
          </div>

          <Card className="gradient-card shadow-soft border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">Officer Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="relative space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Password *
                </Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-7 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              <div className="relative space-y-2">
                <Label htmlFor="confirm" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Confirm Password *
                </Label>
                <Input
                  id="confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirm}
                  onChange={(e) => handleInputChange('confirm', e.target.value)}
                  required
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-7 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your registration will be reviewed by an administrator. 
                  You will be notified once your account is approved.
                </p>
              </div>

              <Button
                onClick={handleSignup}
                disabled={loading}
                className="w-full gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Signup;


