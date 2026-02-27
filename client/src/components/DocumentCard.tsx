import React from "react";
import { Card } from "@/components/ui/card";
import { Document } from "@/shared/schema";
import { FileText, ChevronRight } from "lucide-react";

export interface DocumentCardProps {
  document: Document;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const pdfUrl = `/pdfs/${document.fileName}`;

  return (
    <Card className="p-4 h-full flex flex-col gap-3 border hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-2">
        <FileText size={20} className="text-primary" />
        <h3 className="font-medium text-foreground">{document.title}</h3>
      </div>
      <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
        {document.description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold"
        >
          View PDF
        </a>
        <ChevronRight size={16} className="text-muted-foreground" />
      </div>
    </Card>
  );
};
