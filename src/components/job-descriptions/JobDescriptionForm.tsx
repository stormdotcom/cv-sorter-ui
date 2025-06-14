import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Define JobDescription interface locally
export interface JobDescription {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string[];
  experienceLevel: string;
  employmentType: string;
  salaryRange?: string;
  benefits?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define base schema for form validation
const insertJobDescriptionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  requiredSkills: z.string().min(1, "At least one required skill is needed"),
  preferredSkills: z.string().optional(),
  educationRequirements: z.string().min(1, "At least one education requirement is needed"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  salaryRange: z.string().optional(),
  benefits: z.string().optional()
});

// Form schema with additional validations and transformations
const formSchema = insertJobDescriptionSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requiredSkills: z.string().transform(val => 
    val ? val.split(',').map(s => s.trim()).filter(Boolean) : []
  ),
  preferredSkills: z.string().optional().transform(val => 
    val ? val.split(',').map(s => s.trim()).filter(Boolean) : []
  ),
  educationRequirements: z.string().transform(val => 
    val ? val.split(',').map(s => s.trim()).filter(Boolean) : []
  ),
  benefits: z.string().optional().transform(val => 
    val ? val.split(',').map(s => s.trim()).filter(Boolean) : []
  )
});

type FormValues = z.infer<typeof formSchema>;

interface JobDescriptionFormProps {
  jobId: number | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function JobDescriptionForm({ 
  jobId, 
  onSuccess, 
  onCancel 
}: JobDescriptionFormProps) {
  const { toast } = useToast();
  const isEditMode = jobId !== null;
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState<JobDescription | null>(null);
  
  // Setup form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      description: "",
      requirements: "",
      requiredSkills: "",
      preferredSkills: "",
      educationRequirements: "",
      experienceLevel: "",
      employmentType: "",
      salaryRange: "",
      benefits: ""
    },
  });

  // Fetch job description details if in edit mode
  useEffect(() => {
    const fetchJobData = async () => {
      if (isEditMode && jobId) {
        try {
          setIsLoading(true);
          const data = await apiRequest("GET", `/api/job-descriptions/${jobId}`);
          setJobData(data);
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to fetch job description",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchJobData();
  }, [isEditMode, jobId, toast]);
  
  // Update form with job data when it loads
  useEffect(() => {
    if (isEditMode && jobData) {
      form.reset({
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        description: jobData.description,
        requirements: jobData.requirements,
        requiredSkills: jobData.requiredSkills.join(', '),
        preferredSkills: jobData.preferredSkills?.join(', ') || '',
        educationRequirements: jobData.educationRequirements.join(', '),
        experienceLevel: jobData.experienceLevel,
        employmentType: jobData.employmentType,
        salaryRange: jobData.salaryRange || '',
        benefits: jobData.benefits?.join(', ') || ''
      });
    }
  }, [isEditMode, jobData, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      if (isEditMode) {
        await apiRequest("PATCH", `/api/job-descriptions/${jobId}`, values);
        toast({
          title: "Job description updated",
          description: "The job description has been updated successfully.",
        });
      } else {
        await apiRequest("POST", "/api/job-descriptions", values);
        toast({
          title: "Job description created",
          description: "The job description has been created successfully.",
        });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save job description.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Job Description" : "Create Job Description"}
          </DialogTitle>
        </DialogHeader>
        
        {isEditMode && isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Google" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. New York, Remote" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of the role and responsibilities"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the key requirements for this position"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requiredSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. JavaScript, React, Node.js (comma-separated)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredSkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Skills</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. TypeScript, AWS, Docker (comma-separated)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="educationRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Requirements *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Bachelor's in Computer Science, Master's preferred (comma-separated)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior, Mid, Entry" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Full-time, Contract, Remote" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salaryRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Range</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $100,000 - $150,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefits</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Health insurance, 401(k), Remote work (comma-separated)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : isEditMode ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
