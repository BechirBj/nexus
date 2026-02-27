import { useSubjects } from "@/hooks/use-subjects";
import { Layout } from "@/components/layout";
import { EmptyState } from "@/components/empty-state";
import { CreateSubjectDialog } from "@/components/create-subject-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Boxes, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: subjects, isLoading } = useSubjects();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground mb-2">Workspaces</h1>
            <p className="text-muted-foreground">Manage your research subjects and knowledge bases.</p>
          </div>
          <CreateSubjectDialog />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          </div>
        ) : subjects?.length === 0 ? (
          <EmptyState 
            icon={Boxes}
            title="No workspaces yet"
            description="Create your first workspace to start organizing documents and drafting reports."
            action={<CreateSubjectDialog />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects?.map(subject => (
              <Link key={subject.id} href={`/subjects/${subject.id}`}>
                <Card 
                  className="group relative overflow-hidden h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60 bg-card cursor-pointer"
                >
                  {/* Subtle color bar at top */}
                  <div className="h-2 w-full absolute top-0 left-0 transition-opacity opacity-80 group-hover:opacity-100" style={{ backgroundColor: subject.coverColor }} />
                  
                  <CardHeader className="pb-4 pt-8 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: `${subject.coverColor}40`, color: subject.coverColor === '#e2e8f0' ? '#64748b' : '#334155' }}
                      >
                        <Boxes size={20} />
                      </div>
                      <Badge variant="secondary" className="bg-secondary/50 text-xs font-normal">
                        {subject.visibility}
                      </Badge>
                    </div>
                    <CardTitle className="font-display text-xl mb-2 line-clamp-1">{subject.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground/80 leading-relaxed">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-5">
                    <div className="flex items-center text-xs text-muted-foreground font-medium">
                      Updated {format(new Date(subject.updatedAt!), 'MMM d, yyyy')}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
