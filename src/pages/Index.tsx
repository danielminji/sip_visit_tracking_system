import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, FileText, Clock, Plus, Shield, Users } from "lucide-react";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="SIP+ School Visit Tracking & Reporting System"
        description="Digital school visit tracking system for SIP+ officers. Record visits, select schools, and generate official borang PDFs with ease."
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 py-24 text-center relative">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="hero-text">SIP+</span>
              <br />
              <span className="text-foreground">School Visit Tracking</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Digitize your borang, streamline school visits, and generate official PDFs with precision and speed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/visits/new">
                <Button size="lg" className="gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0 px-8 py-6 text-lg">
                  <Plus className="w-5 h-5 mr-3" />
                  Start New Visit
                </Button>
              </Link>
              <Link to="/schools">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg hover:bg-muted/50 transition-all duration-300">
                  <Building2 className="w-5 h-5 mr-3" />
                  Browse Schools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Streamlined Visit Management</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to conduct, record, and report school visits efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">School Directory</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access comprehensive school information, filter by district, and start visits with one click.
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Digital Forms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Complete all 5 standards digitally with structured forms that mirror the official borang layout.
                </p>
              </CardContent>
            </Card>
            
            <Card className="gradient-card shadow-card hover:shadow-soft transition-all duration-300 border-0 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Visit History</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track all past visits, filter by date ranges, and regenerate official PDFs whenever needed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Ready to modernize your school visits?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join SIP+ officers who are already using our digital tracking system to save time and improve accuracy.
            </p>
            <Link to="/login">
              <Button size="lg" className="gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0 px-12 py-6 text-lg">
                <Shield className="w-5 h-5 mr-3" />
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
