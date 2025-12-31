import { useState, useEffect } from "react";
import { aiAPI } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "@/components/ui/LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import { Compass, Briefcase, TrendingUp, DollarSign, Star, CheckCircle } from "lucide-react";

interface CareerRole {
  role: string;
  difficulty: "Easy" | "Medium" | "Hard";
  salaryRange: string;
  recommendedSkills: string[];
  whyRecommended: string;
}

interface CareerResult {
  roles: CareerRole[];
}

export default function CareerAdvisor() {
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CareerResult | null>(null);

  // Load result from localStorage on component mount
  useEffect(() => {
    const savedResult = localStorage.getItem('careerAdvisorResult');
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!skills || !education || !interests) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const skillsArray = skills.split(",").map(s => s.trim());
      const response = await aiAPI.careerAdvisor(skillsArray, education, interests);
      
      // Parse response data
      const responseData = response.data.data || response.data;
      
      // Handle if response is a string (raw text)
      if (typeof responseData === "string") {
        const cleaned = responseData
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);
        setResult(parsed);
        localStorage.setItem("careerAdvisorResult", JSON.stringify(parsed));
      } else {
        setResult(responseData);
        localStorage.setItem("careerAdvisorResult", JSON.stringify(responseData));
      }

      toast({
        title: "Analysis complete!",
        description: "Your career recommendations are ready.",
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-success";
      case "Medium":
        return "text-warning";
      case "Hard":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getDifficultyWidth = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "33%";
      case "Medium":
        return "66%";
      case "Hard":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div>
      <PageHeader
        title="Career Advisor"
        description="Discover career paths that match your profile and aspirations"
        icon={Compass}
      />

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-card mb-8">
        <div className="space-y-5">
          <div>
            <Label htmlFor="skills" className="text-base font-medium">Your Skills</Label>
            <p className="text-sm text-muted-foreground mb-3">List your technical and soft skills</p>
            <Textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js, Problem Solving, Team Leadership"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="education" className="text-base font-medium">Education Background</Label>
            <p className="text-sm text-muted-foreground mb-3">Your degrees, certifications, courses</p>
            <Textarea
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g., B.S. Computer Science, AWS Certified Developer"
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="interests" className="text-base font-medium">Career Interests</Label>
            <p className="text-sm text-muted-foreground mb-3">What kind of work excites you?</p>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Building products, solving complex problems, leading teams, remote work"
              rows={2}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Analyzing..." : "Get Career Recommendations"}
          </Button>
        </div>
      </form>

      {/* Loading State */}
      {loading && <LoadingOverlay message="Finding your ideal career paths..." />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 animate-slide-up">
          <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-warning" />
            Recommended Career Paths
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {result?.roles?.map((role, index) => (
              <div
                key={role.role}
                className="rounded-xl border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{role?.role ?? "Career Role"}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <DollarSign className="h-3.5 w-3.5 text-success" />
                        <span className="text-sm text-success font-medium">{role?.salaryRange ?? "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                </div>

                {/* Difficulty Meter */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Transition Difficulty</span>
                    <span className={`font-medium ${getDifficultyColor(role?.difficulty ?? "Hard")}`}>
                      {role?.difficulty ?? "N/A"}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        (role?.difficulty) === "Easy"
                          ? "bg-success"
                          : (role?.difficulty) === "Medium"
                          ? "bg-warning"
                          : "bg-destructive"
                      }`}
                      style={{ width: getDifficultyWidth(role?.difficulty ?? "Hard") }}
                    />
                  </div>
                </div>

                {/* Why Recommended */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Why This Fits You</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {role?.whyRecommended ?? "Great fit for your profile"}
                  </p>
                </div>

                {/* Recommended Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Skills to Focus On</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role?.recommendedSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {skill ?? "Skill"}
                      </span>
                    )) ?? <span className="text-xs text-muted-foreground">No specific skills mentioned</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
