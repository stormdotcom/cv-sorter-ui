import React from "react";
import { X } from "lucide-react";
import PdfBlobViewer from "./PdfBlobViewer";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  pdfBlob?: Blob | null;
  pdfUrl?: string;
}

export default function PdfViewerModal({
  isOpen,
  onClose,
  fileName,
  pdfBlob,
  pdfUrl,
}: PdfViewerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full p-4 relative">
        <button
          className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold mb-2">{fileName}</h2>
        <div className="overflow-auto max-h-[70vh]">
          {pdfBlob ? (
            <PdfBlobViewer pdfBlob={pdfBlob} initialSize="medium" />
          ) : pdfUrl ? (
            <PdfBlobViewer pdfUrl={pdfUrl} initialSize="medium" />
          ) : null}
        </div>
      </div>
    </div>
  );
} 
