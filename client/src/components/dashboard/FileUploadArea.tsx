import { useState, useRef } from "react";
import { FileUploadResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type UploadStatus = "idle" | "uploading" | "success" | "error";
type FileStatus = "pending" | "processing" | "complete" | "error";

interface FileInfo {
  id: string;
  name: string;
  status: FileStatus;
  error?: string;
}

// Mock data for file upload simulation
const mockFileUploadResponse: FileUploadResponse = {
  message: "File uploaded successfully",
  filesUploaded: 1,
  candidates: [1] // Mock candidate ID
};

export default function FileUploadArea() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const simulateFileUpload = async (selectedFiles: File[]) => {
    setUploadStatus("uploading");
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate server processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    clearInterval(interval);
    setProgress(100);
    
    // Simulate successful upload
    const uploadedFiles = selectedFiles.map((file, index) => ({
      id: `mock-${index + 1}`,
      name: file.name,
      status: "complete" as FileStatus
    }));
    
    setFiles(uploadedFiles);
    setUploadStatus("success");
    
    toast({
      title: "Upload Successful",
      description: "Your resume has been uploaded successfully.",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      if (selectedFiles.length > 1) {
        toast({
          title: "Single File Only",
          description: "Please select only one file for resume upload.",
          variant: "destructive",
        });
        return;
      }
      setFiles(selectedFiles.map(file => ({
        id: `temp-${Date.now()}-${file.name}`,
        name: file.name,
        status: "pending" as FileStatus
      })));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    try {
      const selectedFiles = files.map(f => new File([], f.name)); // Create mock File objects
      await simulateFileUpload(selectedFiles);
    } catch (error) {
      setUploadStatus("error");
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      if (droppedFiles.length > 1) {
        toast({
          title: "Single File Only",
          description: "Please drop only one file for resume upload.",
          variant: "destructive",
        });
        return;
      }
      setFiles(droppedFiles.map(file => ({
        id: `temp-${Date.now()}-${file.name}`,
        name: file.name,
        status: "pending" as FileStatus
      })));
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>
          Upload a resume in PDF format. Maximum file size is 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
            />
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop a resume here, or click to select a file
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between">
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {file.status === "complete" ? "✓" : file.status}
                  </span>
                </div>
              ))}
              
              {uploadStatus === "uploading" && (
                <Progress value={progress} className="mt-2" />
              )}

              <Button
                type="submit"
                disabled={uploadStatus === "uploading"}
                className="w-full mt-4"
              >
                {uploadStatus === "uploading" ? "Uploading..." : "Upload Resume"}
              </Button>
            </div>
          )}

          {uploadStatus === "error" && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was an error uploading your resume. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
