import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateDocument } from "@/hooks/use-documents";
import { Loader2, UploadCloud } from "lucide-react";

export function CreateDocumentDialog({ subjectId }: { subjectId: number }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  
  const createMutation = useCreateDocument();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { subjectId, title, description, fileName: fileName || `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`, tags: [], linkedReportIds: [] },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setDescription("");
          setFileName("");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-card hover:bg-secondary">
          <UploadCloud size={16} /> Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="doc-title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</Label>
            <Input 
              id="doc-title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              className="bg-secondary/50 border-transparent focus-visible:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doc-desc" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Context</Label>
            <Textarea 
              id="doc-desc" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="bg-secondary/50 border-transparent focus-visible:ring-primary/20 resize-none h-20"
            />
          </div>
          <div className="p-4 border-2 border-dashed border-border rounded-xl text-center cursor-pointer hover:bg-secondary/30 transition-colors">
            <p className="text-sm text-muted-foreground">Drag & drop file here, or click to browse</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Mock upload — enter title above to simulate</p>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending} className="min-w-[100px]">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
