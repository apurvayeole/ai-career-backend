import { useState, useEffect } from "react";
import { aiAPI } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkillInput } from "@/components/ui/SkillInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "@/components/ui/LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import { Map, Calendar, CheckSquare, BookOpen, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoadmapWeek {
  week: number;
  focus: string;
  tasks: string[];
  topics: string[];
}

interface RoadmapResult {
  weeks: RoadmapWeek[];
}

export default function Roadmap() {
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadmapResult | null>(null);

  // Load previous result
  useEffect(() => {
    const saved = localStorage.getItem("roadmapResult");
    if (saved) {
      try {
        setResult(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetRole) {
      toast({ title: "Enter a target role", variant: "destructive" });
      return;
    }
    if (!experienceLevel) {
      toast({ title: "Select experience level", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const response = await aiAPI.roadmap(skills, targetRole, experienceLevel);

      const responseData = response.data.data || response.data;

      let parsedData: RoadmapResult;

      if (typeof responseData === "string") {
        const cleaned = responseData.replace(/```json|```/g, "").trim();
        parsedData = JSON.parse(cleaned);
      } else {
        parsedData = responseData;
      }

      setResult(parsedData);
      localStorage.setItem("roadmapResult", JSON.stringify(parsedData));

      toast({ title: "Roadmap generated!", description: "Your plan is ready." });

    } catch (err: any) {
      toast({
        title: "Failed to generate roadmap",
        description: err.response?.data?.error || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (week: number, totalWeeks: number) =>
    ((week / totalWeeks) * 100).toFixed(0);

  return (
    <div>
      <PageHeader
        title="Roadmap Generator"
        description="Create a structured learning roadmap tailored to your goals"
        icon={Map}
      />

      {/* FORM */}
      <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-card mb-8">
        <div className="space-y-6">
          
          {/* Target Role Input */}
          <div>
            <Label className="text-base font-medium">Target Role</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Example: Backend Developer, MERN Developer, Data Analyst
            </p>
            <Input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Enter your target role"
            />
          </div>

          {/* Experience Level */}
          <div>
            <Label className="text-base font-medium">Experience Level</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select your experience level
            </p>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Choose experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skills Input */}
          <div>
            <Label className="text-base font-medium">Your Current Skills</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Add technologies/languages you already know
            </p>
            <SkillInput skills={skills} onSkillsChange={setSkills} />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Generating..." : "Generate Roadmap"}
          </Button>

        </div>
      </form>

      {loading && <LoadingOverlay message="Creating your roadmap..." />}

      {/* RESULT */}
      {result && !loading && (
        <div className="space-y-6 animate-slide-up">
          
          {/* Summary Card */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Your Learning Roadmap</h3>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{result.weeks.length} weeks</span>
              <span>•</span>
              <span>
                {result.weeks.reduce((acc, w) => acc + w.tasks.length, 0)} tasks
              </span>
              <span>•</span>
              <span>
                {result.weeks.reduce((acc, w) => acc + w.topics.length, 0)} topics
              </span>
            </div>
          </div>

          {/* Weekly Breakdown */}
          <Accordion type="single" collapsible className="space-y-3">
            {result.weeks.map((week) => (
              <AccordionItem
                key={week.week}
                value={`week-${week.week}`}
                className="rounded-xl border bg-card shadow-card overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50">
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-primary-foreground font-bold">
                      W{week.week}
                    </div>

                    <div className="flex-1 text-left">
                      <h4 className="font-medium">{week.focus}</h4>
                      <p className="text-sm text-muted-foreground">
                        {week.tasks.length} tasks • {week.topics.length} topics
                      </p>
                    </div>

                    <div className="hidden md:block w-32">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full"
                          style={{ width: `${progress(week.week, result.weeks.length)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-6 pt-4">

                    {/* Tasks */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckSquare className="h-4 w-4 text-success" />
                        <span className="font-medium">Tasks</span>
                      </div>
                      <ul className="space-y-2">
                        {week.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Topics */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">Topics</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {week.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </AccordionContent>

              </AccordionItem>
            ))}
          </Accordion>

        </div>
      )}
    </div>
  );
}
