import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase, Award, AlertTriangle, Calendar } from "lucide-react";
import { format } from "date-fns";
import PdfBlobViewer from "@/components/ui/pdfviewer/PdfBlobViewer";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobDescriptionDetail({ job }: { job: any }) {
  const [isLoading, setIsLoading] = useState(true);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Cleanup function to revoke blob URL when component unmounts
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const loadPdf = async () => {
      if (job?.file?.blob?.data) {
        try {
          // Convert the byte array to a blob
          const byteArray = new Uint8Array(job.file.blob.data);
          const blob = new Blob([byteArray], { type: job.file.mimeType });
          
          // Create and store the blob URL
          if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
          }
          blobUrlRef.current = URL.createObjectURL(blob);
        } catch (error) {
          console.error("Error creating blob URL:", error);
        }
      }
      setIsLoading(false);
    };

    loadPdf();
  }, [job?.file?.blob?.data, job?.file?.mimeType]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ... existing header content ... */}

      {/* PDF Viewer */}
      {job?.file?.blob?.data && blobUrlRef.current && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Job Description Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] overflow-auto">
              <PdfBlobViewer 
                pdfUrl={blobUrlRef.current} 
                initialSize="medium" 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ... rest of the existing content ... */}
    </div>
  );
} 
