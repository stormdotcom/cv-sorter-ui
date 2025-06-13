import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PropTypes from "prop-types";
import "./PDFViewer.css";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button } from "@/components/ui/button";

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
          <Button variant="outline" size="sm" onClick={prevPage} disabled={pageNumber <= 1}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={!numPages || pageNumber >= numPages}>
            Next
          </Button>
          <div className="size-selector flex gap-1">
            {(["small", "medium", "large"] as const).map((sizeOption) => (
              <Button
                key={sizeOption}
                variant={size === sizeOption ? "default" : "outline"}
                size="sm"
                onClick={() => changeSize(sizeOption)}
              >
                {sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={zoomIn}>Zoom In</Button>
          <Button variant="outline" size="sm" onClick={zoomOut}>Zoom Out</Button>
          <Button variant="outline" size="sm" onClick={downloadPDF}>Download</Button>
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
