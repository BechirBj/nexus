import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateSubject } from "@/hooks/use-subjects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";

const COLORS = [
  '#e2e8f0', '#fee2e2', '#ffedd5', '#dcfce7', '#e0f2fe', '#f3e8ff'
];

interface CreateSubjectDialogProps {
  trigger?: React.ReactNode;
}

export function CreateSubjectDialog({ trigger }: CreateSubjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverColor, setCoverColor] = useState(COLORS[0]);
  const [visibility, setVisibility] = useState("private");
  
  const createMutation = useCreateSubject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { title, description, coverColor, visibility, tags: [] },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setDescription("");
          setCoverColor(COLORS[0]);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="shadow-sm hover:shadow-md transition-all gap-2">
            <Plus size={16} /> New Workspace
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Create Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Q3 Strategic Planning" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              className="bg-secondary/50 border-transparent focus-visible:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Purpose</Label>
            <Textarea 
              id="description" 
              placeholder="What will you organize here?" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="bg-secondary/50 border-transparent focus-visible:ring-primary/20 resize-none"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Identity Color</Label>
              <div className="flex gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCoverColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${coverColor === color ? 'border-primary scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="bg-secondary/50 border-transparent">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="shared">Team Shared</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending} className="min-w-[100px]">
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
