import { z } from 'zod';
import { insertSubjectSchema, insertDocumentSchema, insertReportSchema, subjects, documents, reports } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  subjects: {
    list: {
      method: 'GET' as const,
      path: '/api/subjects' as const,
      responses: {
        200: z.array(z.custom<typeof subjects.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/subjects/:id' as const,
      responses: {
        200: z.custom<typeof subjects.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/subjects' as const,
      input: insertSubjectSchema,
      responses: {
        201: z.custom<typeof subjects.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/subjects/:id' as const,
      input: insertSubjectSchema.partial(),
      responses: {
        200: z.custom<typeof subjects.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  documents: {
    listBySubject: {
      method: 'GET' as const,
      path: '/api/subjects/:subjectId/documents' as const,
      responses: {
        200: z.array(z.custom<typeof documents.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/documents' as const,
      input: insertDocumentSchema,
      responses: {
        201: z.custom<typeof documents.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  reports: {
    listBySubject: {
      method: 'GET' as const,
      path: '/api/subjects/:subjectId/reports' as const,
      responses: {
        200: z.array(z.custom<typeof reports.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/reports/:id' as const,
      responses: {
        200: z.custom<typeof reports.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/reports' as const,
      input: insertReportSchema,
      responses: {
        201: z.custom<typeof reports.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/reports/:id' as const,
      input: insertReportSchema.partial(),
      responses: {
        200: z.custom<typeof reports.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  timeline: {
    listBySubject: {
      method: 'GET' as const,
      path: '/api/subjects/:subjectId/timeline' as const,
      responses: {
        200: z.array(z.object({
          id: z.string(),
          type: z.enum(['document_upload', 'report_created', 'report_updated']),
          itemId: z.number(),
          title: z.string(),
          date: z.string(), // ISO string
        })),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}