import { useRoute, Link } from "wouter";
import { useSubject } from "@/hooks/use-subjects";
import { useDocuments } from "@/hooks/use-documents";
import { useReports } from "@/hooks/use-reports";
import { useTimeline } from "@/hooks/use-timeline";
import { Layout } from "@/components/layout";
import { EmptyState } from "@/components/empty-state";
import { CreateDocumentDialog } from "@/components/create-document-dialog";
import { CreateReportDialog } from "@/components/create-report-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FileText, BookOpen, Clock, ArrowLeft, PenTool, LayoutGrid } from "lucide-react";
import { format } from "date-fns";

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <Card className="p-6 flex items-center gap-4 bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-display font-bold text-foreground">{value}</p>
      </div>
    </Card>
  );
}

export default function SubjectWorkspace() {
  const [, params] = useRoute("/subjects/:id");
  const subjectId = Number(params?.id);

  const { data: subject, isLoading: loadingSub } = useSubject(subjectId);
  const { data: documents = [] } = useDocuments(subjectId);
  const { data: reports = [] } = useReports(subjectId);
  const { data: timeline = [] } = useTimeline(subjectId);

  if (loadingSub) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
      </Layout>
    );
  }

  if (!subject) return <Layout><div className="p-12 text-center">Workspace not found</div></Layout>;

  return (
    <Layout>
      <div 
        className="w-full h-48 absolute top-16 left-0 -z-10 opacity-30 mask-image-gradient"
        style={{ 
          background: `linear-gradient(to bottom, ${subject.coverColor}, transparent)`,
          maskImage: 'linear-gradient(to bottom, black, transparent)'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> All Workspaces
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-display font-bold text-foreground tracking-tight mb-3">{subject.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{subject.description}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <CreateDocumentDialog subjectId={subject.id} />
              <CreateReportDialog subjectId={subject.id} />
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-transparent border-b border-border/60 w-full justify-start rounded-none h-auto p-0 mb-10 gap-8">
            {[
              { id: 'overview', icon: LayoutGrid, label: 'Overview' },
              { id: 'documents', icon: FileText, label: `Resources (${documents.length})` },
              { id: 'reports', icon: PenTool, label: `Reports (${reports.length})` },
              { id: 'timeline', icon: Clock, label: 'Activity' }
            ].map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="relative pb-4 pt-2 px-1 text-sm font-medium text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none outline-none border-none transition-colors"
              >
                <div className="flex items-center gap-2">
                  <tab.icon size={16} />
                  {tab.label}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 transition-transform origin-left data-[state=active]:scale-x-100 hidden [.data-\[state\=active\]_&]:block" />
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Resources Collected" value={documents.length} icon={FileText} />
              <StatCard title="Reports Drafted" value={reports.length} icon={PenTool} />
              <StatCard title="Recent Activities" value={timeline.length} icon={Clock} />
            </div>
            {reports.length > 0 && (
              <div className="pt-6">
                <h3 className="font-display font-semibold text-lg mb-4">Latest Report</h3>
                <Link href={`/reports/${reports[reports.length - 1].id}`}>
                  <Card className="p-6 bg-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-display font-semibold text-xl group-hover:text-primary transition-colors">{reports[reports.length - 1].title}</h4>
                      <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-full uppercase tracking-wider">{reports[reports.length - 1].status}</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 font-serif">{reports[reports.length - 1].content}</p>
                  </Card>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-0 outline-none">
            {documents.length === 0 ? (
              <EmptyState 
                icon={FileText} 
                title="No resources yet" 
                description="Upload PDFs, links, or text snippets to build your knowledge base."
                action={<CreateDocumentDialog subjectId={subject.id} />}
              />
            ) : (
              <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">File / Link</th>
                      <th className="px-6 py-4 text-right">Added On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-secondary/20 transition-colors group">
                        <td className="px-6 py-4 font-medium text-foreground">{doc.title}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-primary/50" />
                            {doc.fileName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">
                          {format(new Date(doc.uploadedAt!), 'MMM d, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="mt-0 outline-none">
            {reports.length === 0 ? (
              <EmptyState 
                icon={PenTool} 
                title="No reports written" 
                description="Synthesize your resources into structured reports and findings."
                action={<CreateReportDialog subjectId={subject.id} />}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map(report => (
                  <Link key={report.id} href={`/reports/${report.id}`}>
                    <Card className="p-6 bg-card border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center">
                          <BookOpen size={16} />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          report.status === 'final' ? 'bg-primary/10 text-primary' : 
                          report.status === 'archived' ? 'bg-muted text-muted-foreground' : 'bg-secondary text-foreground'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{report.title}</h3>
                      <p className="text-muted-foreground text-sm flex-1 font-serif line-clamp-3 mb-4 leading-relaxed">{report.content}</p>
                      <div className="text-xs text-muted-foreground font-medium pt-4 border-t border-border/50">
                        Updated {format(new Date(report.updatedAt!), 'MMM d, yyyy')}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-0 outline-none py-4">
            {timeline.length === 0 ? (
              <EmptyState icon={Clock} title="Quiet here" description="Activity will appear as you add resources and create reports." />
            ) : (
              <div className="max-w-2xl mx-auto space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-border/60">
                {timeline.map((event) => (
                  <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 bg-background shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-primary">
                      {event.type.includes('report') ? <PenTool size={16} /> : <FileText size={16} />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {event.type.replace('_', ' ')}
                        </span>
                        <time className="text-xs font-medium text-muted-foreground/70">
                          {format(new Date(event.date), 'MMM d, h:mm a')}
                        </time>
                      </div>
                      <h4 className="font-display font-medium text-foreground text-base">{event.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
