export interface UploadStats {
  totalFiles: number;
  processedFiles: number;
  successfulUploads: number;
  failedUploads: number;
  errors: string[];
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface ValidationResult {
  type: 'validateProgress';
  totalCount: number;
  validCount: number;
  invalidCount: number;
}

export interface BatchProgress {
  type: 'batchProgress';
  successCount: number;
  failCount: number;
  totalBatches: number;
  completedBatches: number;
}

export interface UploadDone {
  type: 'done';
  successCount: number;
  failCount: number;
  invalidCount: number;
} 
