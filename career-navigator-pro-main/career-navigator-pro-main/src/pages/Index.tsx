import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary animate-pulse-glow">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Project O</h1>
      <p className="text-lg text-muted-foreground mb-8">AI Career Mentor</p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Index;
