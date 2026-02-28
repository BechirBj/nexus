import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Report, type InsertReport } from "@shared/schema";

export function useReports(subjectId: number) {
  return useQuery({
    queryKey: [api.reports.listBySubject.path, subjectId],
    queryFn: async () => {
      try {
        const url = buildUrl(api.reports.listBySubject.path, { subjectId });
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        const parsed = api.reports.listBySubject.responses[200].safeParse(data);
        if (!parsed.success) throw new Error("Invalid response format");
        return parsed.data as Report[];
      } catch {
        const fallback = await fetch("/reports.json");
        if (!fallback.ok) throw new Error("Failed to load reports.json");
        const list = (await fallback.json()) as Report[];
        return list.filter((r: any) => r.subjectId === subjectId) as any;
      }
    },
    enabled: !!subjectId && !isNaN(subjectId),
  });
}

export function useReport(id: number) {
  return useQuery({
    queryKey: [api.reports.get.path, id],
    queryFn: async () => {
      try {
        const url = buildUrl(api.reports.get.path, { id });
        const res = await fetch(url);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch report");
        const data = await res.json();
        const parsed = api.reports.get.responses[200].safeParse(data);
        if (!parsed.success) throw new Error("Invalid response format");
        return parsed.data as Report;
      } catch {
        const fallback = await fetch("/reports.json");
        if (!fallback.ok) throw new Error("Failed to load reports.json");
        const list = (await fallback.json()) as Report[];
        const found = list.find((r: any) => r.id === id) ?? null;
        return found as any;
      }
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: InsertReport) => {
      const res = await fetch(api.reports.create.path, {
        method: api.reports.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create report");
      const data = await res.json();
      return api.reports.create.responses[201].parse(data) as Report;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.reports.listBySubject.path, variables.subjectId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [api.timeline.listBySubject.path, variables.subjectId] 
      });
    },
  });
}

export function useUpdateReport(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<InsertReport>) => {
      const url = buildUrl(api.reports.update.path, { id });
      const res = await fetch(url, {
        method: api.reports.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update report");
      const data = await res.json();
      return api.reports.update.responses[200].parse(data) as Report;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.reports.get.path, id] });
      queryClient.invalidateQueries({ 
        queryKey: [api.reports.listBySubject.path, data.subjectId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [api.timeline.listBySubject.path, data.subjectId] 
      });
    },
  });
}
