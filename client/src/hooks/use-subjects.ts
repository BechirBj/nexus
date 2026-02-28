import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Subject, type InsertSubject } from "@shared/schema";

export function useSubjects() {
  return useQuery({
    queryKey: [api.subjects.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.subjects.list.path);
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        const parsed = api.subjects.list.responses[200].safeParse(data);
        if (!parsed.success) throw new Error("Invalid response format");
        return parsed.data as Subject[];
      } catch {
        const fallback = await fetch("/subjects.json");
        if (!fallback.ok) throw new Error("Failed to load subjects.json");
        const json = await fallback.json();
        return json as Subject[];
      }
    },
  });
}

export function useSubject(id: number) {
  return useQuery({
    queryKey: [api.subjects.get.path, id],
    queryFn: async () => {
      try {
        const url = buildUrl(api.subjects.get.path, { id });
        const res = await fetch(url);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch subject");
        const data = await res.json();
        const parsed = api.subjects.get.responses[200].safeParse(data);
        if (!parsed.success) throw new Error("Invalid response format");
        return parsed.data as Subject;
      } catch {
        const fallback = await fetch("/subjects.json");
        if (!fallback.ok) throw new Error("Failed to load subjects.json");
        const list = (await fallback.json()) as Subject[];
        const found = list.find((s: any) => s.id === id) ?? null;
        return found as any;
      }
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: InsertSubject) => {
      const res = await fetch(api.subjects.create.path, {
        method: api.subjects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create subject");
      const data = await res.json();
      return api.subjects.create.responses[201].parse(data) as Subject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.subjects.list.path] });
    },
  });
}
