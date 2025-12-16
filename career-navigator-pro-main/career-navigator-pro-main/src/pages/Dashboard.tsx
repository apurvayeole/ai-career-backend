import { useAuth } from "@/lib/auth-context";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Target, Map, Compass, FileText, History, Sparkles } from "lucide-react";

const features = [
  {
    title: "Skill Gap Analysis",
    description: "Identify missing skills for your target role and get personalized learning resources.",
    icon: Target,
    href: "/skill-gap",
  },
  {
    title: "Roadmap Generator",
    description: "Create a structured learning plan with weekly tasks and milestones.",
    icon: Map,
    href: "/roadmap",
  },
  {
    title: "Career Advisor",
    description: "Discover career paths that match your skills, education, and interests.",
    icon: Compass,
    href: "/career-advisor",
  },
  {
    title: "Resume Analysis",
    description: "Upload your resume for AI-powered feedback and ATS optimization tips.",
    icon: FileText,
    href: "/resume-analysis",
  },
  {
    title: "History",
    description: "View all your past analyses and recommendations in one place.",
    icon: History,
    href: "/history",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary animate-pulse-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name?.split(" ")[0] || "there"}!
            </h1>
            <p className="text-muted-foreground">
              What would you like to work on today?
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">AI Features</p>
          <p className="text-3xl font-bold text-foreground mt-1">5</p>
          <p className="text-xs text-primary mt-1">All available</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Analyses Today</p>
          <p className="text-3xl font-bold text-foreground mt-1">0</p>
          <p className="text-xs text-muted-foreground mt-1">Start exploring</p>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <p className="text-sm text-muted-foreground">Career Score</p>
          <p className="text-3xl font-bold text-foreground mt-1">—</p>
          <p className="text-xs text-muted-foreground mt-1">Analyze resume to unlock</p>
        </div>
      </div>

      {/* Feature Cards */}
      <h2 className="text-lg font-semibold text-foreground mb-4">AI Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <FeatureCard key={feature.href} {...feature} gradient />
        ))}
      </div>
    </div>
  );
}
