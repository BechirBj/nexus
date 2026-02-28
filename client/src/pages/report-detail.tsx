import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useReport, useUpdateReport } from "@/hooks/use-reports";
import { useSubject } from "@/hooks/use-subjects";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, FileText, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

export default function ReportDetail() {
  const [, params] = useRoute("/reports/:id");
  const reportId = Number(params?.id);

  const { data: report, isLoading: loadingRep } = useReport(reportId);
  const { data: subject, isLoading: loadingSub } = useSubject(report?.subjectId || 0);
  
  const updateMutation = useUpdateReport(reportId);

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (report && !isEditing) {
      setContent(report.content);
    }
  }, [report, isEditing]);

  const handleSave = async () => {
    await updateMutation.mutateAsync({ content });
    setIsEditing(false);
  };

  if (loadingRep || loadingSub) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
      </Layout>
    );
  }

  if (!report || !subject) return <Layout><div className="p-12 text-center">Report not found</div></Layout>;

  return (
    <Layout>
      <div className="flex-1 flex w-full">
        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl mx-auto px-6 py-12 lg:px-12 bg-background border-r border-border/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <div className="mb-10">
            <Link href={`/subjects/${subject.id}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Back to {subject.title}
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Select 
                  value={report.status} 
                  onValueChange={(val) => updateMutation.mutate({ status: val })}
                >
                  <SelectTrigger className="w-[130px] h-8 text-xs font-semibold uppercase tracking-wider bg-secondary/50 border-none rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="final">Final Status</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm font-medium text-muted-foreground/60">
                  {format(new Date(report.updatedAt!), 'MMMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button onClick={handleSave} disabled={updateMutation.isPending} size="sm" className="gap-2 shadow-sm">
                    <Save size={14} /> Save Changes
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2 bg-card">
                    Edit Document
                  </Button>
                )}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-[1.15] tracking-tight">{report.title}</h1>
          </div>

          <div className="prose prose-lg prose-p:font-serif prose-p:leading-loose prose-p:text-[1.1rem] prose-p:text-foreground/80 max-w-none">
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[500px] font-serif text-lg leading-loose resize-none bg-transparent border-border/50 focus-visible:ring-1 focus-visible:ring-primary/20 p-6 rounded-2xl shadow-inner"
                autoFocus
              />
            ) : (
              <div className="whitespace-pre-wrap mt-8">
                {report.content.split('\n\n').map((paragraph:any, i:any) => (
                  <p key={i} className="mb-6">{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Meta & Mock Comments */}
        <div className="hidden xl:flex w-80 flex-col bg-secondary/20 p-6">
          <div className="mb-8">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Linked Resources</h4>
            <div className="space-y-3">
              {/* Mocking linked documents for visual completeness */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50 hover:border-border transition-colors cursor-pointer">
                <FileText size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">Reference_Data_2024.pdf</p>
                  <p className="text-xs text-muted-foreground mt-1">Uploaded Oct 12</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground mt-2 border border-dashed border-border/80">
                + Link Resource
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Notes & Review</h4>
            <div className="flex-1 border border-border/50 bg-card rounded-xl flex flex-col p-4">
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <MessageSquare size={24} className="text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Review comments will appear here when collaborating.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <Input placeholder="Add a comment..." className="bg-secondary/50 border-none text-sm"></Input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
