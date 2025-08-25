import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import Iridescence from "@/components/ui/Iridescence";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background iridescence overlay */}
      <Iridescence 
        color={[0.8, 0.6, 1.0]} 
        speed={0.8} 
        amplitude={0.05} 
        mouseReact={true}
      />
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-purple-600">SIP+</span>
            <span className="text-gray-800"> School Visit Tracking</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Digitize your borang, streamline school visits, and generate official PDFs with precision and speed.
          </p>
          
          {/* Mobile-friendly buttons with touch feedback */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-4 touch-manipulation"
            >
              <Link to="/visits/new">
                <Plus className="mr-2 h-5 w-5" />
                Start New Visit
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-4 touch-manipulation"
            >
              <Link to="/schools">
                <Building2 className="mr-2 h-5 w-5" />
                Browse Schools
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
            Streamlined Visit Management
          </h2>
          <p className="text-center text-lg text-gray-600 mb-12">
            Everything you need to conduct, record, and report school visits efficiently.
          </p>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-100">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">Digital Forms</h3>
              <p className="text-gray-600">Complete visit forms digitally with real-time validation and auto-save.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-100">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">Photo Evidence</h3>
              <p className="text-gray-600">Capture and organize photos directly within the application.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-100">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">PDF Reports</h3>
              <p className="text-gray-600">Generate professional PDF reports instantly for official use.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
