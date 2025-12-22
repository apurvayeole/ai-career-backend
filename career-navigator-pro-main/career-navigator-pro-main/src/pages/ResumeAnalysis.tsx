import { useState, useRef } from "react";
import { aiAPI } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import { FileText, Upload, CheckCircle, XCircle, Lightbulb, FileCheck, X } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ResumeResult {
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: string[];
  improvedSummary: string;
  atsScore: number;
}

export default function ResumeAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your resume first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.resumeAnalysis(file);
      
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
        description: "Your resume analysis is ready.",
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(142, 76%, 36%)";
    if (score >= 60) return "hsl(38, 92%, 50%)";
    return "hsl(0, 84%, 60%)";
  };

  return (
    <div>
      <PageHeader
        title="Resume Analysis"
        description="Get AI-powered feedback to optimize your resume for ATS and recruiters"
        icon={FileText}
      />

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 shadow-card mb-8">
        <div className="space-y-5">
          <div>
            <label className="text-base font-medium text-foreground">Upload Resume (PDF)</label>
            <p className="text-sm text-muted-foreground mb-3">Drag and drop or click to select</p>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                file ? "border-primary bg-primary-light/30" : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">PDF only, max 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={loading || !file} className="w-full md:w-auto">
            {loading ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </div>
      </form>

      {/* Loading State */}
      {loading && <LoadingOverlay message="Analyzing your resume..." />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6 animate-slide-up">
          {/* ATS Score */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={result.atsScore}
                  text={`${result.atsScore}%`}
                  styles={buildStyles({
                    textSize: "20px",
                    pathColor: getScoreColor(result.atsScore),
                    textColor: "hsl(220, 20%, 10%)",
                    trailColor: "hsl(220, 14%, 96%)",
                  })}
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-semibold text-xl text-foreground">ATS Compatibility Score</h3>
                <p className="text-muted-foreground mt-1">
                  {result.atsScore >= 80
                    ? "Excellent! Your resume is well-optimized for ATS."
                    : result.atsScore >= 60
                    ? "Good, but there's room for improvement."
                    : "Your resume needs optimization to pass ATS filters."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-success" />
                <h3 className="font-semibold text-lg">Strengths</h3>
              </div>
              <ul className="space-y-3">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 shrink-0 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-destructive" />
                <h3 className="font-semibold text-lg">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                {result.weaknesses.map((weakness, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 shrink-0 mt-0.5">
                      <XCircle className="h-3 w-3 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-warning" />
              <h3 className="font-semibold text-lg">Suggested Improvements</h3>
            </div>
            <ul className="space-y-3">
              {result.suggestedImprovements.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warning/10 text-warning font-medium text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improved Summary */}
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Improved Summary</h3>
            </div>
            <div className="rounded-lg bg-primary-light/50 border border-primary/20 p-4">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {result.improvedSummary}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Copy this optimized summary to your resume for better results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
