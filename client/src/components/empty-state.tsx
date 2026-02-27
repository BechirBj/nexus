import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border/60 rounded-2xl bg-card/30 backdrop-blur-sm transition-all duration-300 hover:bg-card/50">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-muted-foreground shadow-sm">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed text-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
