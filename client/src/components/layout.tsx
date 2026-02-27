import { ReactNode } from "react";
import { Link } from "wouter";
import { LayoutGrid, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <LayoutGrid size={18} />
            </div>
            <Link href="/" className="font-display font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity">
              Nexus
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full hover:bg-secondary">
              <Search size={18} />
            </Button>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground border border-border">
              <User size={16} />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
