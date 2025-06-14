/// <reference types="vite/client" />

// Allow any import ending in ?url
declare module '*?url';

// Add PDF.js module declarations
declare module 'pdfjs-dist/build/pdf' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  
  export const version: string;
  
  export interface PDFDocumentLoadingOptions {
    data: ArrayBuffer;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
    disableStream?: boolean;
    disableAutoFetch?: boolean;
  }
  
  export function getDocument(options: PDFDocumentLoadingOptions): {
    promise: Promise<PDFDocumentProxy>;
  };
  
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): Promise<void>;
  }
  
  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>;
  }
  
  export interface TextContent {
    items: Array<{
      str: string;
    }>;
  }
} 
