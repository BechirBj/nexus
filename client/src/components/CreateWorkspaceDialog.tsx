import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubjects } from "@/hooks/use-subjects";
import { FolderPlus } from "lucide-react";

export const CreateWorkspaceDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { addSubject } = useSubjects();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSubject({
      title,
      description,
      coverColor: "#e2e8f0",
      visibility: "private",
      tags: [],
    });
    setOpen(false);
    setTitle("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-card hover:bg-secondary">
          <FolderPlus size={16} /> Add Workspace
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Add Workspace
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label
              htmlFor="ws-title"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Title
            </Label>
            <Input
              id="ws-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-secondary/50 border-transparent focus-visible:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="ws-desc"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Context
            </Label>
            <Input
              id="ws-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary/50 border-transparent focus-visible:ring-primary/20"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title} className="min-w-[100px]">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
