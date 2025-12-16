import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface SkillInputProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function SkillInput({ skills, onSkillsChange, placeholder = "Type a skill and press Enter", className }: SkillInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!skills.includes(inputValue.trim())) {
        onSkillsChange([...skills, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-sm font-medium text-primary"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
