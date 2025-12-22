import { useState } from "react";
import { aiAPI } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkillInput } from "@/components/ui/SkillInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "@/components/ui/LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import { Target, CheckCircle, XCircle, AlertTriangle, Clock, Book, Youtube, GraduationCap, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SkillGapResult {
  existingSkills: string[];
  missingSkills: { skill: string; description: string }[];
  priority: { skill: string; level: "High" | "Medium" | "Low" }[];
  timeline: { skill: string; weeks: number }[];
  resources: {
    skill: string;
    youtube?: string[];
    courses?: string[];
    books?: string[];
  }[];
}

export default function SkillGap() {
  const [skills, setSkills] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillGapResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      toast({
        title: "Please add at least one skill",
        variant: "destructive",
      });
      return;
    }

    if (!targetRole) {
      toast({
        title: "Please specify a target role",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.skillGap(skills, targetRole);
      
      // Parse response data
      const responseData = response.data.data || response.data;
      
      // Handle if response is a string (raw text)
      if (typeof responseData === 'string') {
        try {
          const parsed = JSON.parse(responseData);
          setResult(parsed);
        } catch {
          toast({
            title: "Response",
            description: responseData,
          });
        }
      } else {
        setResult(responseData);
      }

      toast({
        title: "Analysis complete!",
        description: "Your skill gap analysis is ready.",
      });
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || "Please try again later.";
      toast({
        title: "Analysis failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Low":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div>
      <PageHeader
        title="Skill Gap Analysis"
        description="Discover what skills you need to reach your target role"
        icon={Target}
      />

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-card mb-8">
        <div className="space-y-5">
          <div>
            <Label htmlFor="skills" className="text-base font-medium">Your Current Skills</Label>
            <p className="text-sm text-muted-foreground mb-3">Add your existing skills</p>
            <SkillInput skills={skills} onSkillsChange={setSkills} />
          </div>

          <div>
            <Label htmlFor="targetRole" className="text-base font-medium">Target Role</Label>
            <p className="text-sm text-muted-foreground mb-3">What position are you aiming for?</p>
            <Input
              id="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Analyzing..." : "Analyze Skill Gap"}
          </Button>
        </div>
      </form>

      {/* Loading State */}
      {loading && <LoadingOverlay message="Analyzing your skills..." />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6 animate-slide-up">
          {/* Existing Skills */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-lg">Existing Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.existingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-success/10 px-3 py-1.5 text-sm font-medium text-success border border-success/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-lg">Missing Skills</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.missingSkills.map((item) => (
                <div
                  key={item.skill}
                  className="rounded-lg border bg-background p-4"
                >
                  <h4 className="font-medium text-foreground">{item.skill}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Levels */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="font-semibold text-lg">Learning Priority</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.priority.map((item) => (
                <span
                  key={item.skill}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium border ${getPriorityColor(item.level)}`}
                >
                  {item.skill} • {item.level}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Estimated Timeline</h3>
            </div>
            <div className="space-y-4">
              {result.timeline.map((item) => (
                <div key={item.skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.skill}</span>
                    <span className="text-muted-foreground">{item.weeks} weeks</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((item.weeks / 12) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Book className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Learning Resources</h3>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {result.resources.map((item, index) => (
                <AccordionItem key={item.skill} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.skill}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {item.youtube && item.youtube.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Youtube className="h-4 w-4 text-destructive" />
                            <span className="text-sm font-medium">YouTube</span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {item.youtube.map((link, i) => (
                              <li key={i}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.courses && item.courses.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Courses</span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {item.courses.map((course, i) => (
                              <li key={i} className="text-sm text-muted-foreground">• {course}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.books && item.books.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Book className="h-4 w-4 text-warning" />
                            <span className="text-sm font-medium">Books</span>
                          </div>
                          <ul className="space-y-1 ml-6">
                            {item.books.map((book, i) => (
                              <li key={i} className="text-sm text-muted-foreground">• {book}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}
