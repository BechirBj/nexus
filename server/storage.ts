import { 
  subjects, type Subject, type InsertSubject, type UpdateSubjectRequest,
  documents, type Document, type InsertDocument,
  reports, type Report, type InsertReport, type UpdateReportRequest
} from "@shared/schema";

export interface IStorage {
  // Subjects
  getSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, subject: UpdateSubjectRequest): Promise<Subject>;

  // Documents
  getDocumentsBySubject(subjectId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;

  // Reports
  getReportsBySubject(subjectId: number): Promise<Report[]>;
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, report: UpdateReportRequest): Promise<Report>;
}

export class MemStorage implements IStorage {
  private subjects: Map<number, Subject>;
  private documents: Map<number, Document>;
  private reports: Map<number, Report>;
  private currentSubjectId: number = 1;
  private currentDocumentId: number = 1;
  private currentReportId: number = 1;

  constructor() {
    this.subjects = new Map();
    this.documents = new Map();
    this.reports = new Map();
  }

  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values()).sort((a, b) => 
      (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)
    );
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentSubjectId++;
    const subject: Subject = {
      ...insertSubject,
      id,
      coverColor: insertSubject.coverColor ?? '#e2e8f0',
      visibility: insertSubject.visibility ?? 'private',
      tags: insertSubject.tags ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.subjects.set(id, subject);
    return subject;
  }

  async updateSubject(id: number, updates: UpdateSubjectRequest): Promise<Subject> {
    const subject = await this.getSubject(id);
    if (!subject) throw new Error("Subject not found");
    
    const updated = { ...subject, ...updates, updatedAt: new Date() };
    this.subjects.set(id, updated);
    return updated;
  }

  async getDocumentsBySubject(subjectId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.subjectId === subjectId)
      .sort((a, b) => (b.uploadedAt?.getTime() || 0) - (a.uploadedAt?.getTime() || 0));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const document: Document = {
      ...insertDocument,
      id,
      tags: insertDocument.tags ?? [],
      linkedReportIds: insertDocument.linkedReportIds ?? [],
      uploadedAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async getReportsBySubject(subjectId: number): Promise<Report[]> {
    return Array.from(this.reports.values())
      .filter(rep => rep.subjectId === subjectId)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const report: Report = {
      ...insertReport,
      id,
      status: insertReport.status ?? 'draft',
      tags: insertReport.tags ?? [],
      linkedDocumentIds: insertReport.linkedDocumentIds ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.reports.set(id, report);
    return report;
  }

  async updateReport(id: number, updates: UpdateReportRequest): Promise<Report> {
    const report = await this.getReport(id);
    if (!report) throw new Error("Report not found");
    
    const updated = { ...report, ...updates, updatedAt: new Date() };
    this.reports.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();

// Helper to seed database
export async function seedDatabase() {
  const subjects = await storage.getSubjects();
  if (subjects.length > 0) return; // Already seeded

  const s1 = await storage.createSubject({
    title: "Philosophy of Mind",
    description: "Reading notes and essays on consciousness and identity.",
    coverColor: "#fef08a",
    visibility: "private",
    tags: ["philosophy", "cognition"]
  });

  const s2 = await storage.createSubject({
    title: "Machine Learning Concepts",
    description: "Key concepts and mathematical foundations of AI.",
    coverColor: "#bfdbfe",
    visibility: "shared",
    tags: ["ai", "tech"]
  });

  const d1 = await storage.createDocument({
    subjectId: s1.id,
    title: "Descartes Error",
    description: "Chapter 1 summary",
    fileName: "descartes-error.pdf",
    tags: ["book"],
    linkedReportIds: []
  });

  await storage.createReport({
    subjectId: s1.id,
    title: "Notes on Dualism",
    content: "## Overview\n\nDualism is the concept that the mind and body are distinct and separable...\n\n### Key arguments\n\n- The knowledge argument\n- The conceivability argument\n",
    status: "final",
    tags: ["drafting"],
    linkedDocumentIds: [d1.id]
  });

  await storage.createDocument({
    subjectId: s2.id,
    title: "Attention Is All You Need",
    description: "Original Transformer paper",
    fileName: "attention.pdf",
    tags: ["paper", "reference"],
    linkedReportIds: []
  });
}