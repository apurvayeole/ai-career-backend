import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { aiAPI } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingOverlay } from "@/components/ui/LoadingSpinner";
import { toast } from "@/hooks/use-toast";
import { History as HistoryIcon, Target, Map, Compass, FileText, Calendar, ChevronRight, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryItem {
  _id: string;
  type: "skill-gap" | "roadmap" | "career-advisor" | "resume-analysis";
  createdAt: string;
  result: any;
}

const typeConfig = {
  "skill-gap": {
    label: "Skill Gap Analysis",
    icon: Target,
    color: "bg-primary-light text-primary",
  },
  roadmap: {
    label: "Roadmap",
    icon: Map,
    color: "bg-success/10 text-success",
  },
  "career-advisor": {
    label: "Career Advisor",
    icon: Compass,
    color: "bg-warning/10 text-warning",
  },
  "resume-analysis": {
    label: "Resume Analysis",
    icon: FileText,
    color: "bg-destructive/10 text-destructive",
  },
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user?.id) return;

    try {
      const response = await aiAPI.history();
      setHistory(response.data.data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load history",
        description: error.response?.data?.error || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupByType = (items: HistoryItem[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, HistoryItem[]>);
  };

  const renderResultPreview = (item: HistoryItem) => {
    switch (item.type) {
      case "skill-gap":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Missing Skills</h4>
              <div className="flex flex-wrap gap-2">
                {item.result.missingSkills?.slice(0, 5).map((s: any) => (
                  <span key={s.skill} className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                    {s.skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case "roadmap":
        return (
          <div>
            <h4 className="font-medium text-sm mb-2">Weeks Overview</h4>
            <p className="text-sm text-muted-foreground">
              {item.result.weeks?.length} weeks planned
            </p>
          </div>
        );
      case "career-advisor":
        return (
          <div>
            <h4 className="font-medium text-sm mb-2">Recommended Roles</h4>
            <div className="flex flex-wrap gap-2">
              {item.result.roles?.slice(0, 3).map((r: any) => (
                <span key={r.role} className="text-xs bg-primary-light text-primary px-2 py-1 rounded-full">
                  {r.role}
                </span>
              ))}
            </div>
          </div>
        );
      case "resume-analysis":
        return (
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${item.result.atsScore >= 80 ? "text-success" : item.result.atsScore >= 60 ? "text-warning" : "text-destructive"}`}>
                {item.result.atsScore}%
              </div>
              <p className="text-xs text-muted-foreground">ATS Score</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const grouped = groupByType(history);

  return (
    <div>
      <PageHeader
        title="History"
        description="View all your past AI analyses and recommendations"
        icon={HistoryIcon}
      />

      {loading && <LoadingOverlay message="Loading your history..." />}

      {!loading && history.length === 0 && (
        <div className="rounded-xl border bg-card p-12 shadow-card text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <HistoryIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No history yet</h3>
          <p className="text-muted-foreground">
            Start using AI features to see your analysis history here.
          </p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => {
            const config = typeConfig[type as keyof typeof typeConfig];
            const Icon = config.icon;

            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="font-semibold text-lg">{config.label}</h2>
                  <span className="text-sm text-muted-foreground">({items.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => setSelectedItem(item)}
                      className="rounded-xl border bg-card p-5 shadow-card text-left hover:shadow-card-hover hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(item.createdAt)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="h-3.5 w-3.5" />
                          View Details
                        </div>
                      </div>
                      {renderResultPreview(item)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem && typeConfig[selectedItem.type] && (
                <>
                  {(() => {
                    const Icon = typeConfig[selectedItem.type].icon;
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                  {typeConfig[selectedItem.type].label}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedItem && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Analyzed on {formatDate(selectedItem.createdAt)}
                </p>
                <pre className="text-sm bg-secondary rounded-lg p-4 overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedItem.result, null, 2)}
                </pre>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
