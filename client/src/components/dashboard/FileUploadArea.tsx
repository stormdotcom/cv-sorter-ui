import { useState, useRef } from "react";
import { FileUploadResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { fileUpload, searchResumes } from "@/http/apiCalls";
import { Input } from "@headlessui/react";

type UploadStatus = "idle" | "uploading" | "success" | "error";
type FileStatus = "pending" | "processing" | "complete" | "error";

interface FileInfo {
  id: string;
  name: string;
  status: FileStatus;
  error?: string;
}

const ALLOWED_FILE_TYPES = [".pdf", ".txt"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export default function FileUploadArea() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
//  mimic the setProgress function, max 5 seconds
  const setProgressStateMimic = (value: number) => {
    setProgress(value);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = setInterval(() => {
      setProgress(progress + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(progressIntervalRef.current!);
      setProgress(100);
    }, 5000);
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      return `File type not supported. Please upload only PDF or TXT files.`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 5MB limit.`;
    }

    return null;
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

      const file = selectedFiles[0];
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Invalid File",
          description: error,
          variant: "destructive",
        });
        return;
      }

      setFiles(selectedFiles);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    try {
      setProgressStateMimic(0);
      setLoading(true);
      const formData = new FormData();
      formData.append("file", files[0]);
      await fileUpload(formData);
      setLoading(false);
      toast({
        title: "Uploaded",
        description: "Resume uploaded successfully.",
      });
      //  reset the form
      setFiles([]);
      setUploadStatus("idle");
      setProgress(0);
      fileInputRef.current!.value = "";
      //  reset the form data
      formData.delete("file");
    } catch (error) {
      setUploadStatus("error");
      toast({
        title: "Upload Failed",
        description:
          "There was an error uploading your resume. Please try again.",
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

      const file = droppedFiles[0];
      const error = validateFile(file);
      if (error) {
        toast({
          title: "Invalid File",
          description: error,
          variant: "destructive",
        });
        return;
      }

      setFiles(droppedFiles);
    }
  };

 
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Upload Resume</CardTitle>
        <CardDescription>
          Upload a resume in PDF or TXT format. Maximum file size is 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div
            className="border-2 border-dashed rounded-lg p-4 w-full text-center cursor-pointer hover:border-primary transition-colors"
            style={{ minHeight: 120 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.txt"
              className="hidden"
            />
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop a PDF or TXT resume here, or click to select a file
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Maximum file size: 5MB
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-4">
              {files.map((file: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {file.status === "complete" ? "✓" : file.status}
                  </span>
                </div>
              ))}

              {loading && (
                <Progress value={progress} className="mt-2" />
              )}

              <Button
                type="submit"
                disabled={uploadStatus === "uploading"}
                className="w-full mt-4"
              >
                {loading && (
                  <span className="animate-spin inline-block mr-2 align-middle">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  </span>
                )}
                {loading ? "Uploading..." : "Upload Resume"}
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
