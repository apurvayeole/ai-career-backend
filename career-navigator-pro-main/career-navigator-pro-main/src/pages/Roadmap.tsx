import { useState } from "react";
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
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("30");
  const [currentSkills, setCurrentSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadmapResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goal) {
      toast({
        title: "Please specify a learning goal",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await aiAPI.roadmap(goal, parseInt(duration), currentSkills);
      
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
        title: "Roadmap generated!",
        description: "Your personalized learning roadmap is ready.",
      });
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || "Please try again later.";
      toast({
        title: "Generation failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWeekProgress = (weekNum: number, totalWeeks: number) => {
    return ((weekNum / totalWeeks) * 100).toFixed(0);
  };

  return (
    <div>
      <PageHeader
        title="Roadmap Generator"
        description="Create a structured learning plan to achieve your career goals"
        icon={Map}
      />

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-card mb-8">
        <div className="space-y-5">
          <div>
            <Label htmlFor="goal" className="text-base font-medium">Learning Goal</Label>
            <p className="text-sm text-muted-foreground mb-3">What do you want to achieve?</p>
            <Input
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Become a full-stack developer"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration" className="text-base font-medium">Duration</Label>
            <p className="text-sm text-muted-foreground mb-3">How long do you have?</p>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="60">60 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="skills" className="text-base font-medium">Current Skills</Label>
            <p className="text-sm text-muted-foreground mb-3">What do you already know? (optional)</p>
            <SkillInput skills={currentSkills} onSkillsChange={setCurrentSkills} />
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Generating..." : "Generate Roadmap"}
          </Button>
        </div>
      </form>

      {/* Loading State */}
      {loading && <LoadingOverlay message="Creating your roadmap..." />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6 animate-slide-up">
          {/* Progress Overview */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Your {duration}-Day Roadmap</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{result.weeks.length} weeks</span>
              <span>•</span>
              <span>{result.weeks.reduce((acc, w) => acc + w.tasks.length, 0)} tasks</span>
              <span>•</span>
              <span>{result.weeks.reduce((acc, w) => acc + w.topics.length, 0)} topics</span>
            </div>
          </div>

          {/* Weekly Breakdown */}
          <Accordion type="single" collapsible className="space-y-3">
            {result.weeks.map((week, index) => (
              <AccordionItem
                key={week.week}
                value={`week-${week.week}`}
                className="rounded-xl border bg-card shadow-card overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50">
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-primary-foreground font-bold text-sm shrink-0">
                      W{week.week}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-foreground">{week.focus}</h4>
                      <p className="text-sm text-muted-foreground">
                        {week.tasks.length} tasks • {week.topics.length} topics
                      </p>
                    </div>
                    <div className="hidden md:block w-32">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full"
                          style={{ width: `${getWeekProgress(week.week, result.weeks.length)}%` }}
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
                        <span className="font-medium text-sm">Tasks</span>
                      </div>
                      <ul className="space-y-2">
                        {week.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Topics */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Topics to Learn</span>
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
