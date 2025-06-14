import { GlobalWorkerOptions, version } from 'pdfjs-dist/build/pdf';

// Set worker path based on environment
if (import.meta.env.DEV) {
  // In development, use the worker from node_modules
  GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
} else {
  // In production, use the bundled worker
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
  ).toString();
} 
