import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import PropTypes from "prop-types";
import "./PDFViewer.css";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
// Set the worker path for react-pdf (Vite/Webpack compatible)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PdfBlobViewer = ({
  pdfUrl,
  initialSize = "medium",
}: {
  pdfUrl: string;
  initialSize: string;
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState(initialSize);

  const viewerRef = useRef(null);

  // Adjust size of the viewer
  const sizeOptions = {
    small: 0.6,
    medium: 1,
    large: 1.5,
  };

  // Adjust zoom in and zoom out functionality
  const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2));
  const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "document.pdf";
    link.click();
  };

  // Page navigation handlers
  const nextPage = () => {
    if (pageNumber && numPages && pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  const prevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const changeSize = (newSize: string) => {
    setSize(newSize);
    setZoom(sizeOptions[newSize as keyof typeof sizeOptions]);
  };

  useEffect(() => {
    setZoom(sizeOptions[size as keyof typeof sizeOptions]);
  }, [size]);

  // Conditionally render the PDF controls based on the size
  const renderControls = size !== "small";

  return (
    <div className="pdf-viewer-container">
      {renderControls && (
        <div className="pdf-controls">
          <button onClick={prevPage}>Previous</button>
          <button onClick={nextPage}>Next</button>
          <div className="size-selector">
            <button onClick={() => changeSize("small")}>Small</button>
            <button onClick={() => changeSize("medium")}>Medium</button>
            <button onClick={() => changeSize("large")}>Large</button>
          </div>
          <button onClick={zoomIn}>Zoom In</button>
          <button onClick={zoomOut}>Zoom Out</button>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      )}

      <div ref={viewerRef} className="pdf-viewer">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          options={{ cMapUrl: "cmaps/", cMapPacked: true }}
        >
          <Page
            pageNumber={pageNumber}
            scale={zoom * sizeOptions[size as keyof typeof sizeOptions]}
            width={viewerRef.current ? (viewerRef.current as HTMLElement).offsetWidth : undefined}
          />
        </Document>
      </div>

      {renderControls && (
        <div className="page-count">
          <p>Page {pageNumber} of {numPages}</p>
        </div>
      )}
    </div>
  );
};

PdfBlobViewer.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
  initialSize: PropTypes.oneOf(["small", "medium", "large"]),
};

export default PdfBlobViewer;
