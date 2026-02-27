import type { Express } from "express";
import type { Server } from "http";
import { storage, seedDatabase } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database on startup
  await seedDatabase();

  app.get(api.subjects.list.path, async (req, res) => {
    const subjects = await storage.getSubjects();
    res.json(subjects);
  });

  app.get(api.subjects.get.path, async (req, res) => {
    const subject = await storage.getSubject(Number(req.params.id));
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  });

  app.post(api.subjects.create.path, async (req, res) => {
    try {
      const input = api.subjects.create.input.parse(req.body);
      const subject = await storage.createSubject(input);
      res.status(201).json(subject);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.patch(api.subjects.update.path, async (req, res) => {
    try {
      const input = api.subjects.update.input.parse(req.body);
      const subject = await storage.updateSubject(Number(req.params.id), input);
      res.json(subject);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(404).json({ message: "Not found" });
    }
  });

  // Documents
  app.get(api.documents.listBySubject.path, async (req, res) => {
    const docs = await storage.getDocumentsBySubject(Number(req.params.subjectId));
    res.json(docs);
  });

  app.post(api.documents.create.path, async (req, res) => {
    try {
      const input = api.documents.create.input.parse(req.body);
      const doc = await storage.createDocument(input);
      res.status(201).json(doc);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Reports
  app.get(api.reports.listBySubject.path, async (req, res) => {
    const reports = await storage.getReportsBySubject(Number(req.params.subjectId));
    res.json(reports);
  });

  app.get(api.reports.get.path, async (req, res) => {
    const report = await storage.getReport(Number(req.params.id));
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  });

  app.post(api.reports.create.path, async (req, res) => {
    try {
      const input = api.reports.create.input.parse(req.body);
      const report = await storage.createReport(input);
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.patch(api.reports.update.path, async (req, res) => {
    try {
      const input = api.reports.update.input.parse(req.body);
      const report = await storage.updateReport(Number(req.params.id), input);
      res.json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(404).json({ message: "Not found" });
    }
  });

  // Timeline (mock logic based on uploadedAt and createdAt)
  app.get(api.timeline.listBySubject.path, async (req, res) => {
    const subjectId = Number(req.params.subjectId);
    const docs = await storage.getDocumentsBySubject(subjectId);
    const reps = await storage.getReportsBySubject(subjectId);
    
    const timeline: Array<{id: string, type: 'document_upload' | 'report_created' | 'report_updated', itemId: number, title: string, date: string}> = [];
    
    docs.forEach(d => {
      if (d.uploadedAt) {
        timeline.push({
          id: `doc-${d.id}`,
          type: 'document_upload',
          itemId: d.id,
          title: `Uploaded document: ${d.title}`,
          date: d.uploadedAt.toISOString(),
        });
      }
    });

    reps.forEach(r => {
      if (r.createdAt) {
        timeline.push({
          id: `rep-create-${r.id}`,
          type: 'report_created',
          itemId: r.id,
          title: `Created report: ${r.title}`,
          date: r.createdAt.toISOString(),
        });
      }
      if (r.updatedAt && r.updatedAt.getTime() > r.createdAt!.getTime() + 1000) {
        timeline.push({
          id: `rep-update-${r.id}`,
          type: 'report_updated',
          itemId: r.id,
          title: `Updated report: ${r.title}`,
          date: r.updatedAt.toISOString(),
        });
      }
    });

    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(timeline);
  });

  return httpServer;
}