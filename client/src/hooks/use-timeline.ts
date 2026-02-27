import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

type TimelineEvent = {
  id: string;
  type: 'document_upload' | 'report_created' | 'report_updated';
  itemId: number;
  title: string;
  date: string;
};

export function useTimeline(subjectId: number) {
  return useQuery({
    queryKey: [api.timeline.listBySubject.path, subjectId],
    queryFn: async () => {
      const url = buildUrl(api.timeline.listBySubject.path, { subjectId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch timeline");
      const data = await res.json();
      const parsed = api.timeline.listBySubject.responses[200].safeParse(data);
      if (!parsed.success) throw new Error("Invalid response format");
      return parsed.data as TimelineEvent[];
    },
    enabled: !!subjectId && !isNaN(subjectId),
  });
}
