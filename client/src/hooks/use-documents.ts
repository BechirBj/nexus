import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Document, type InsertDocument } from "@shared/schema";

export function useDocuments(subjectId: number) {
  return useQuery({
    queryKey: [api.documents.listBySubject.path, subjectId],
    queryFn: async () => {
      const url = buildUrl(api.documents.listBySubject.path, { subjectId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      const parsed = api.documents.listBySubject.responses[200].safeParse(data);
      if (!parsed.success) throw new Error("Invalid response format");
      return parsed.data as Document[];
    },
    enabled: !!subjectId && !isNaN(subjectId),
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: InsertDocument) => {
      const res = await fetch(api.documents.create.path, {
        method: api.documents.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create document");
      const data = await res.json();
      return api.documents.create.responses[201].parse(data) as Document;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.documents.listBySubject.path, variables.subjectId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [api.timeline.listBySubject.path, variables.subjectId] 
      });
    },
  });
}
