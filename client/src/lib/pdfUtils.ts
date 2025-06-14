import { getDocument, PDFDocumentProxy } from 'pdfjs-dist/build/pdf';

export async function hasTextContent(file: File): Promise<boolean> {
  try {
    // 1) load the ArrayBuffer
    const data = await file.arrayBuffer();

    // 2) open with PDF.js
    const loadingTask = getDocument({ data });
    const pdf: PDFDocumentProxy = await loadingTask.promise;

    let fullText = '';
    // 3) loop pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // concatenate all the 'str' chunks
      fullText += textContent.items.map((it: any) => it.str).join(' ');
      if (fullText.trim().length > 0) {
        // short-circuit once we find any real text
        await pdf.destroy();
        return true;
      }
    }

    await pdf.destroy();
    return false;
  } catch (error) {
    console.error('Error validating PDF:', error);
    return false;
  }
}

export async function validateFile(file: File): Promise<boolean> {
  if (file.name.toLowerCase().endsWith('.txt')) {
    // For text files, just check if they're not empty
    const text = await file.text();
    return text.trim().length > 0;
  } else if (file.name.toLowerCase().endsWith('.pdf')) {
    // For PDFs, check if they contain text
    return hasTextContent(file);
  }
  return false;
} 
