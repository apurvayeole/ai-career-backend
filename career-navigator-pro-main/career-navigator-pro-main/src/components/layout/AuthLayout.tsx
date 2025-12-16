import { Outlet, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative z-10 text-center text-primary-foreground max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Project O</h1>
          <p className="text-xl opacity-90 mb-6">AI Career Mentor</p>
          <p className="text-primary-foreground/80 leading-relaxed">
            Unlock your career potential with AI-powered insights. Get personalized skill gap analysis, 
            learning roadmaps, career advice, and resume optimization.
          </p>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Project O</h1>
              <p className="text-sm text-muted-foreground">AI Career Mentor</p>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
