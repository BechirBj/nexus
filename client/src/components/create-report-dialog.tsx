import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateReport } from "@/hooks/use-reports";
import { Loader2, PenTool } from "lucide-react";

export function CreateReportDialog({ subjectId }: { subjectId: number }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const createMutation = useCreateReport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { subjectId, title, content, status: 'draft', tags: [], linkedDocumentIds: [] },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setContent("");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm hover:shadow-md transition-all">
          <PenTool size={16} /> Draft Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Draft New Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4 flex flex-col h-[60vh] max-h-[600px]">
          <div className="space-y-2">
            <Label htmlFor="report-title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Report Title</Label>
            <Input 
              id="report-title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              className="bg-secondary/50 border-transparent focus-visible:ring-primary/20 font-display text-lg px-4 py-6"
              placeholder="Analysis on..."
            />
          </div>
          <div className="space-y-2 flex-1 flex flex-col">
            <Label htmlFor="report-content" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Initial Thoughts</Label>
            <Textarea 
              id="report-content" 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="flex-1 bg-secondary/30 border-transparent focus-visible:ring-primary/20 resize-none font-serif leading-relaxed text-base p-4"
              placeholder="Begin writing your findings..."
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 shrink-0">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending} className="min-w-[120px]">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Draft"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
