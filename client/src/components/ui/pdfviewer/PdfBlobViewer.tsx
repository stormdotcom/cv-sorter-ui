import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PropTypes from "prop-types";
import "./PDFViewer.css";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Minimize2, Maximize2, MoreHorizontal, ZoomIn, ZoomOut, Download } from "lucide-react";

// Set the worker path for react-pdf (Vite/Webpack compatible)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfBlobViewerProps {
  pdfUrl: string;
  initialSize?: "small" | "medium" | "large";
  onError?: (error: Error) => void;
}

const PdfBlobViewer: React.FC<PdfBlobViewerProps> = ({
  pdfUrl,
  initialSize = "medium",
  onError,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState(initialSize);
  const [error, setError] = useState<Error | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);

  // Size options for different view modes
  const sizeOptions = {
    small: 0.6,
    medium: 1,
    large: 1.5,
  };

  // Cleanup function for blob URLs
  useEffect(() => {
    return () => {
      if (pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  // Handle document load error
  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError(error);
    onError?.(error);
  };

  // Navigation handlers
  const nextPage = () => {
    if (pageNumber && numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  // Zoom handlers
  const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2));
  const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));

  // Size change handler
  const changeSize = (newSize: "small" | "medium" | "large") => {
    setSize(newSize);
    setZoom(sizeOptions[newSize]);
  };

  // Update zoom when size changes
  useEffect(() => {
    setZoom(sizeOptions[size]);
  }, [size]);

  // Download handler
  const downloadPDF = () => {
    if (!pdfUrl) return;
    
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine if we should show controls
  const renderControls = size !== "small";

  if (error) {
    return (
      <div className="pdf-error p-4 text-center text-destructive">
        <p>Error loading PDF: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer-container">
      {renderControls && (
        <div className="pdf-controls flex items-center gap-2 p-2 bg-muted rounded-t">
          <Button variant="outline" size="icon" onClick={prevPage} disabled={pageNumber <= 1} title="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextPage} disabled={!numPages || pageNumber >= numPages} title="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="size-selector flex gap-1">
            <Button
              key="small"
              variant={"outline"}
              size="icon"
              onClick={() => changeSize("small" as const)}
              title="Small"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              key="medium"
              variant={size === "medium" ? "default" : "outline"}
              size="icon"
              onClick={() => changeSize("medium")}
              title="Medium"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button
              key="large"
              variant={size === "large" ? "default" : "outline"}
              size="icon"
              onClick={() => changeSize("large")}
              title="Large"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={downloadPDF} title="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div ref={viewerRef} className="pdf-viewer bg-background">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
          options={{
            cMapUrl: "https://unpkg.com/pdfjs-dist@3.4.120/cmaps/",
            cMapPacked: true,
          }}
        >
          <Page
            pageNumber={pageNumber}
            scale={zoom * sizeOptions[size]}
            width={viewerRef.current ? viewerRef.current.offsetWidth : undefined}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {renderControls && numPages && (
        <div className="pdf-footer p-2 text-center text-sm text-muted-foreground bg-muted rounded-b">
          Page {pageNumber} of {numPages}
        </div>
      )}
    </div>
  );
};

PdfBlobViewer.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
  initialSize: PropTypes.oneOf(["small", "medium", "large"]),
  onError: PropTypes.func,
};

export default PdfBlobViewer;
