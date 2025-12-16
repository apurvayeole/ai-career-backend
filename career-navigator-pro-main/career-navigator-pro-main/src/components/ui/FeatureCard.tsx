import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient?: boolean;
}

export function FeatureCard({ title, description, icon: Icon, href, gradient = false }: FeatureCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        gradient && "overflow-hidden"
      )}
    >
      {gradient && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gradient-hero" />
      )}
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="relative z-10">
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Get Started</span>
        <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
