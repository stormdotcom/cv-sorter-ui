import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { FileText, Loader2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { fileUploadMultiple } from "../../http/apiCalls";
import { toast as hotToast, Toaster } from 'react-hot-toast';

const ALLOWED_FILE_TYPES = [".pdf", ".txt"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 50;
const BATCH_SIZE = 5;

interface UploadStats {
  total: number;
  valid: number;
  invalid: number;
  success: number;
  failed: number;
  totalBatches: number;
  completedBatches: number;
  invalidFiles: string[]; // Track invalid file names
}

function FileUploadArea() {
  const [files, setFiles] = useState<File[]>([]);
  const [stats, setStats] = useState<UploadStats>({
    total: 0,
    valid: 0,
    invalid: 0,
    success: 0,
    failed: 0,
    totalBatches: 0,
    completedBatches: 0,
    invalidFiles: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const processingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const processingIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const uploadToastRef = useRef<string>();
  const processingToastRef = useRef<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
      }
    };
  }, []);

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(ext)) {
      return { 
        isValid: false, 
        error: `${file.name}: File type not supported. Please upload only PDF or TXT files.` 
      };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: `${file.name}: File size exceeds 5MB limit.` 
      };
    }
    return { isValid: true };
  };

  const processFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length > MAX_FILES) {
      toast({
        title: "Too Many Files",
        description: `You can select up to ${MAX_FILES} files at once.`,
        variant: "destructive",
      });
      return;
    }

    // Validate all files
    const validationResults = selectedFiles.map(file => ({
      file,
      ...validateFile(file)
    }));

    const validFiles = validationResults.filter(r => r.isValid).map(r => r.file);
    const invalidFiles = validationResults
      .filter(r => !r.isValid)
      .map(r => r.error)
      .filter((error): error is string => error !== undefined);

    if (invalidFiles.length > 0) {
      toast({
        title: "Some Files Invalid",
        description: invalidFiles.join('\n'),
        variant: "destructive",
      });
    }

    setFiles(validFiles);
    setStats({
      total: selectedFiles.length,
      valid: validFiles.length,
      invalid: invalidFiles.length,
      success: 0,
      failed: 0,
      totalBatches: Math.ceil(validFiles.length / BATCH_SIZE),
      completedBatches: 0,
      invalidFiles,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const uploadBatch = async (batch: File[], batchNumber: number, totalBatches: number): Promise<number> => {
    try {
      const formData = new FormData();
      batch.forEach(file => {
        formData.append('files', file);
      });

      const { results } = await fileUploadMultiple(formData);
      console.log('Upload results:', results);
      
      // Update progress
      const batchProgress = (batchNumber / totalBatches) * 100;
      setUploadProgress(batchProgress);
      
      // Update toast message with loading state
      if (uploadToastRef.current) {
        hotToast.loading(
          `Uploading files... ${Math.round(batchProgress)}% (Batch ${batchNumber}/${totalBatches})`,
          { id: uploadToastRef.current }
        );
      }

      return results.length;
    } catch (error) {
      console.error('Upload error:', error);
      hotToast.error(
        `Failed to upload batch ${batchNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { id: uploadToastRef.current }
      );
      throw error;
    }
  };

  const startUpload = async () => {
    if (files.length === 0) {
      hotToast.error("Please select valid files to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingProgress(0);
    let totalProcessedFiles = 0;

    try {
      // Start upload toast with loading state
      uploadToastRef.current = hotToast.loading("Preparing upload...");

      const totalBatches = Math.ceil(files.length / BATCH_SIZE);
      
      // Process files in batches
      for (let i = 0; i < files.length; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        
        const processedCount = await uploadBatch(batch, batchNumber, totalBatches);
        totalProcessedFiles += processedCount;
      }

      // Upload complete - update toast to success
      if (uploadToastRef.current) {
        hotToast.success("Upload complete!", { id: uploadToastRef.current });
      }

      // Start processing if we have files to process
      if (totalProcessedFiles > 0) {
        setIsProcessing(true);
        const totalProcessingTime = totalProcessedFiles * 12; // 12 seconds per file
        let elapsedTime = 0;

        // Start processing toast with loading state
        processingToastRef.current = hotToast.loading("Processing files...");

        // Update processing progress
        processingIntervalRef.current = setInterval(() => {
          elapsedTime += 1;
          const progress = (elapsedTime / totalProcessingTime) * 100;
          setProcessingProgress(progress);

          if (processingToastRef.current) {
            hotToast.loading(
              `Processing files... ${Math.round(progress)}% (${elapsedTime}s/${totalProcessingTime}s)`,
              { id: processingToastRef.current }
            );
          }

          if (elapsedTime >= totalProcessingTime) {
            if (processingIntervalRef.current) {
              clearInterval(processingIntervalRef.current);
            }
            if (processingToastRef.current) {
              hotToast.success("Processing complete!", { id: processingToastRef.current });
            }
            setIsProcessing(false);
            window.location.reload();
          }
        }, 1000);
      }

    } catch (error) {
      console.error('Upload process failed:', error);
      if (uploadToastRef.current) {
        hotToast.error("Upload failed!", { id: uploadToastRef.current });
      }
    } finally {
      setIsUploading(false);
      // Reset form
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const progressPercent = stats.total
    ? Math.round(((stats.success + stats.failed) / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          loading: {
            duration: Infinity,
            icon: '🔄',
          },
          success: {
            duration: 3000,
            icon: '✅',
          },
          error: {
            duration: 4000,
            icon: '❌',
          },
        }}
      />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bulk Resume Upload</CardTitle>
          <CardDescription>
            Select up to {MAX_FILES} PDF/TXT files. Invalid files will be skipped. Files will be uploaded in batches of {BATCH_SIZE}.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            style={{ minHeight: 120 }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileSelect}
            />
            <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop files here, or click to select
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Maximum {MAX_FILES} files, 5MB per file
            </p>
          </div>

          {stats.total > 0 && (
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total Selected:</div>
                <div>{stats.total}</div>
                <div>Valid:</div>
                <div>{stats.valid}</div>
                <div>Invalid:</div>
                <div>{stats.invalid}</div>
                {stats.invalidFiles.length > 0 && (
                  <div className="col-span-2 text-xs text-destructive mt-1">
                    Invalid files: {stats.invalidFiles.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {stats.totalBatches > 0 && (
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Batches:</div>
                <div>{stats.completedBatches}/{stats.totalBatches}</div>
                <div>Uploaded:</div>
                <div>{stats.success}/{stats.total} ({progressPercent}%)</div>
                <div>Failed:</div>
                <div>{stats.failed}</div>
              </div>
              <Progress value={progressPercent} className="mt-2" />
            </div>
          )}

          <Button
            onClick={startUpload}
            disabled={files.length === 0 || isUploading || isProcessing}
            className="w-full mt-4"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Start Upload"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Progress indicators */}
      {(isUploading || isProcessing) && (
        <div className="space-y-2">
          {isUploading && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          {isProcessing && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Processing files...</span>
                <span>{Math.round(processingProgress)}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUploadArea;
