import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Target, 
  CheckCircle, 
  Play, 
  Eye, 
  FileText,
  Plus,
  Sparkles,
  Lightbulb,
  Award
} from 'lucide-react';

interface StandardFormProps {
  standardCode: string;
  standardTitle: string;
  aspectCode: string;
  aspectTitle: string;
  plan: string[];
  doText: string;
  setDoText: (text: string) => void;
  checkCriteria: string[];
  checkResults: string[];
  setCheckResults: (results: string[]) => void;
  actText: string;
  setActText: (text: string) => void;
  evidences: string[];
  setEvidences: (evidences: string[]) => void;
  quickSuggestions: {
    do: string[];
    act: string[];
  };
}

export default function StandardForm({
  standardCode,
  standardTitle,
  aspectCode,
  aspectTitle,
  plan,
  doText,
  setDoText,
  checkCriteria,
  checkResults,
  setCheckResults,
  actText,
  setActText,
  evidences,
  setEvidences,
  quickSuggestions
}: StandardFormProps) {
  const [activeSection, setActiveSection] = useState<'plan' | 'do' | 'check' | 'act' | 'evidence'>('plan');

  const addQuickSuggestion = (type: 'do' | 'act', suggestion: string) => {
    if (type === 'do') {
      setDoText(prev => prev ? `${prev}\n• ${suggestion}` : `• ${suggestion}`);
    } else {
      setActText(prev => prev ? `${prev}\n• ${suggestion}` : `• ${suggestion}`);
    }
  };

  const toggleEvidence = (evidence: string) => {
    setEvidences(prev => 
      prev.includes(evidence) 
        ? prev.filter(e => e !== evidence)
        : [...prev, evidence]
    );
  };

  const toggleCheckResult = (result: string) => {
    setCheckResults(prev => 
      prev.includes(result) 
        ? prev.filter(r => r !== result)
        : [...prev, result]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6" />
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {standardCode}
          </Badge>
        </div>
        <h2 className="text-2xl font-bold mb-1">{standardTitle}</h2>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span className="text-lg font-semibold">{aspectCode}: {aspectTitle}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'plan', label: 'PLAN', icon: Target, color: 'from-green-500 to-emerald-600' },
          { id: 'do', label: 'DO', icon: Play, color: 'from-blue-500 to-cyan-600' },
          { id: 'check', label: 'CHECK', icon: CheckCircle, color: 'from-orange-500 to-amber-600' },
          { id: 'act', label: 'ACT', icon: Eye, color: 'from-purple-500 to-pink-600' },
          { id: 'evidence', label: 'EVIDENCE', icon: FileText, color: 'from-indigo-500 to-blue-600' }
        ].map(({ id, label, icon: Icon, color }) => (
          <Button
            key={id}
            variant={activeSection === id ? "default" : "outline"}
            onClick={() => setActiveSection(id as any)}
            className={`transition-all duration-300 ${
              activeSection === id 
                ? `bg-gradient-to-r ${color} text-white border-0 shadow-lg` 
                : 'hover:shadow-md'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* PLAN Section */}
        {activeSection === 'plan' && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                PLAN - Implementation Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {plan.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* DO Section */}
        {activeSection === 'do' && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                DO - Implementation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  value={doText}
                  onChange={(e) => setDoText(e.target.value)}
                  placeholder="Enter implementation details..."
                  className="min-h-[120px] border-2 border-blue-200 focus:border-blue-500"
                />
                
                {/* Quick Suggestions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 font-medium">
                    <Sparkles className="w-4 h-4" />
                    Quick Suggestions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.do.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addQuickSuggestion('do', suggestion)}
                        className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CHECK Section */}
        {activeSection === 'check' && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                CHECK - Assessment & Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Assessment Criteria */}
                <div>
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Assessment Criteria
                  </h4>
                  <div className="space-y-2">
                    {checkCriteria.map((criterion, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                          {index + 1}
                        </Badge>
                        <span className="text-gray-700">{criterion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Results */}
                <div>
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Assessment Results
                  </h4>
                  <div className="space-y-2">
                    {checkResults.map((result, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Checkbox
                          checked={checkResults.includes(result)}
                          onCheckedChange={() => toggleCheckResult(result)}
                          className="border-orange-300 data-[state=checked]:bg-orange-500"
                        />
                        <span className="text-gray-700">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ACT Section */}
        {activeSection === 'act' && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                ACT - Follow-up Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Textarea
                  value={actText}
                  onChange={(e) => setActText(e.target.value)}
                  placeholder="Enter follow-up actions..."
                  className="min-h-[120px] border-2 border-purple-200 focus:border-purple-500"
                />
                
                {/* Quick Suggestions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-700 font-medium">
                    <Sparkles className="w-4 h-4" />
                    Quick Suggestions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.act.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addQuickSuggestion('act', suggestion)}
                        className="bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* EVIDENCE Section */}
        {activeSection === 'evidence' && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                EVIDENCE - Supporting Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evidences.map((evidence, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Checkbox
                      checked={evidences.includes(evidence)}
                      onCheckedChange={() => toggleEvidence(evidence)}
                      className="border-indigo-300 data-[state=checked]:bg-indigo-500"
                    />
                    <span className="text-gray-700">{evidence}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
