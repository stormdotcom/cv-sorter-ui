import { GlobalWorkerOptions, version } from 'pdfjs-dist/build/pdf';

// Set worker path for Web Worker context
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`; 
