import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X } from "lucide-react";
import { createJobApi } from "@/http/apiCalls";

// Form validation schema
const jobDescriptionSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company_name: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  job_type: z.string().min(1, "Job type is required"),
  requirements: z.array(z.string().min(1, "Requirement cannot be empty"))
    .min(1, "At least one requirement is needed"),
});

type JobDescriptionFormValues = z.infer<typeof jobDescriptionSchema>;

export default function JobDescriptionForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobDescriptionFormValues>({
    resolver: zodResolver(jobDescriptionSchema),
    defaultValues: {
      title: "",
      company_name: "",
      location: "",
      job_type: "",
      requirements: [""],
    },
  });

  const onSubmit = async (data: JobDescriptionFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API cal
      await createJobApi(data);
      
      toast({
        title: "Success",
        description: "Job description created successfully",
      });
      setLocation("/job-descriptions");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job description",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRequirement = () => {
    const requirements = form.getValues("requirements");
    form.setValue("requirements", [...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    const requirements = form.getValues("requirements");
    if (requirements.length > 1) {
      form.setValue(
        "requirements",
        requirements.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => setLocation("/job-descriptions")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Job Descriptions
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., TechCorp Inc." {...field} />
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
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="job_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full-time, Contract" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Requirements</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRequirement}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Requirement
                  </Button>
                </div>

                {form.watch("requirements").map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`requirements.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={`Requirement ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch("requirements").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/job-descriptions")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Job Description"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 
