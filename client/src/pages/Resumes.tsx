import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Download, Trash2, Eye, FileText, X } from "lucide-react";
import { deleteFileApi, listResumes } from "@/http/apiCalls";
import PdfBlobViewer from "@/components/ui/pdfviewer/PdfBlobViewer";

import { Header } from "@/components/layout/Header";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Helper function to create a blob URL from resume data
function createBlobUrl(resume: any): string | null {
  if (!resume.blob?.data) return null;

  try {
    let byteArray: Uint8Array;
    
    if (typeof resume.blob.data === 'string') {
      // Handle base64 string
      const binary = atob(resume.blob.data);
      byteArray = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        byteArray[i] = binary.charCodeAt(i);
      }
    } else if (Array.isArray(resume.blob.data)) {
      // Handle number array
      byteArray = new Uint8Array(resume.blob.data as number[]);
    } else if (resume.blob.data instanceof Uint8Array) {
      // Handle Uint8Array
      byteArray = new Uint8Array(resume.blob.data.buffer);
    } else {
      console.error('Unsupported blob data type:', typeof resume.blob.data);
      return null;
    }

    // Create a new ArrayBuffer from the byteArray to ensure type compatibility
    const buffer = new ArrayBuffer(byteArray.length);
    new Uint8Array(buffer).set(byteArray);
    
    // Create blob from the buffer
    const blob = new Blob([buffer], { type: resume.mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating blob URL:', error);
    return null;
  }
}

export default function ResumesPage() {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [viewPdf, setViewPdf] = useState<string | null>(null);
  const [modalResume, setModalResume] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const blobUrlsRef = useRef<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchResumes = async () => {
      setIsLoading(true);
      try {
        const filter = {
          page,
          limit,
        };
        const { data, total: totalCount } = await listResumes(filter);
        // Clean up previous blob URLs
        Object.values(blobUrlsRef.current).forEach(url => URL.revokeObjectURL(url));
        blobUrlsRef.current = {};
        setResumes(data);
        setTotal(totalCount || 0);
      } catch (e) {
        toast({ title: "Error", description: "Failed to fetch resumes", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumes();
    return () => {
      Object.values(blobUrlsRef.current).forEach(url => URL.revokeObjectURL(url));
      blobUrlsRef.current = {};
    };
  }, [ page, limit]);

  const filteredResumes = useMemo(() => {
    let filtered = resumes.filter((r) => {
      const searchLower = search.toLowerCase();
      return (
        r.fileName.toLowerCase().includes(searchLower) ||
        (r.shortDescription && r.shortDescription.toLowerCase().includes(searchLower)) ||
        (r.topSkills && r.topSkills.join(" ").toLowerCase().includes(searchLower)) ||
        (r.jobTitles && r.jobTitles.join(" ").toLowerCase().includes(searchLower))
      );
    });
    filtered = filtered.sort((a, b) => {
      if (sort === "newest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return filtered;
  }, [resumes, search, sort]);

  const handleDownload = (resume: any) => {
    window.open(resume.tempLocation || '#', '_blank');
    toast({ title: "Download", description: `Downloading ${resume.fileName}` });
  };

  const handleDelete = async (resume: any) => {
    try {
      await deleteFileApi(resume._id);
      toast({ title: "Deleted", description: `Resume ${resume.fileName} deleted.` });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete resume", variant: "destructive" });
    }
  };

  const handleView = (resume: any) => {
    setModalResume(resume);
    
    if (resume.tempLocation) {
      setViewPdf(resume.tempLocation);
    } else if (resume.blob?.data) {
      const url = createBlobUrl(resume);
      if (url) {
        // Store the URL for cleanup
        blobUrlsRef.current[resume._id] = url;
        setViewPdf(url);
      }
    }
  };

  const closeModal = () => {
    if (viewPdf && viewPdf.startsWith('blob:') && modalResume) {
      URL.revokeObjectURL(blobUrlsRef.current[modalResume._id]);
      delete blobUrlsRef.current[modalResume._id];
    }
    setViewPdf(null);
    setModalResume(null);
  };
  const handleCloseModal = async () => {
    setIsConfirmationModalOpen(false);
    setModalResume(null);
    // after 700 ms, fetch the resumes
    setTimeout(async () => {
      await listResumes({page: 1, limit: 10});
    }, 700);
  }
  const handleConfirmDelete = (resume: any) => {
    setModalResume(resume);
    setIsConfirmationModalOpen(true);
  }

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(blobUrlsRef.current).forEach(URL.revokeObjectURL);
      blobUrlsRef.current = {};
    };
  }, []);

  return (
    <div>
      <Header title="Resumes" />

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search by file, skill, job title, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <select
            className="border rounded-md px-3 py-2 text-sm bg-background"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <div>No resumes found.</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <Card key={resume._id} className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-base font-semibold truncate max-w-[180px]">
                      {resume.fileName}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {formatDate(resume.createdAt)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
              
                  {/* PDF Preview or Icon */}
                  <div className="flex items-center justify-center h-32 bg-muted rounded mb-4">
                    {resume.mimeType === "application/pdf" ? (
                      (() => {
                        if (resume.tempLocation) {
                          return <PdfBlobViewer pdfUrl={resume.tempLocation} initialSize="small" />;
                        } else if (resume.blob?.data) {
                          const url = createBlobUrl(resume);
                          if (url) {
                            blobUrlsRef.current[resume._id] = url;
                            return <PdfBlobViewer pdfUrl={url} initialSize="small" />;
                          }
                        }
                        return <FileText className="h-12 w-12 text-muted-foreground" />;
                      })()
                    ) : (
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="mb-2 space-y-1">
                    {resume.shortDescription && (
                      <div className="text-xs text-muted-foreground line-clamp-2">{resume.shortDescription}</div>
                    )}
                    {resume.topSkills && resume.topSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {resume.topSkills.map((skill: string) => (
                          <span key={skill} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    {resume.jobTitles && resume.jobTitles.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {resume.jobTitles.map((title: string) => (
                          <span key={title} className="bg-muted text-xs px-2 py-0.5 rounded-full">
                            {title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleView(resume)}
                      title="View"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDownload(resume)}
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleConfirmDelete(resume)}
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * limit + 1, total)}-
              {Math.min(page * limit, total)} of {total} resumes
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </Button>
              {/* Page numbers (show up to 5 pages) */}
              {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
                .filter(p =>
                  p === 1 ||
                  p === Math.ceil(total / limit) ||
                  (p >= page - 2 && p <= page + 2)
                )
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && p - arr[idx - 1] > 1 && <span className="px-1">...</span>}
                    <Button
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className={p === page ? "font-bold" : ""}
                    >
                      {p}
                    </Button>
                  </React.Fragment>
                ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page === Math.ceil(total / limit) || total === 0}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
              <select
                className="border rounded-md px-2 py-1 text-sm ml-2 bg-background"
                value={limit}
                onChange={e => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[10, 20, 50, 100].map(opt => (
                  <option key={opt} value={opt}>{opt} / page</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {/* PDF Modal */}
      {viewPdf && modalResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full p-4 relative">
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
              onClick={closeModal}
              title="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold mb-2">{modalResume.fileName}</h2>
            <div className="overflow-auto max-h-[70vh]">
              <PdfBlobViewer
                pdfUrl={viewPdf}
                initialSize="medium"
                onError={(error) => {
                  toast({
                    title: "Error",
                    description: `Failed to load PDF: ${error.message}`,
                    variant: "destructive",
                  });
                  closeModal();
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        resume={modalResume}
        title="Delete Resume"
        description={`Are you sure you want to delete the resume "${modalResume?.fileName}"?`}
      /> */}
    </div>

  );
}

