import { z } from "zod";

export interface Candidate {
  id: number;
  name: string;
  email: string;
  position?: string;
  experience?: string;
  skills?: string[];
  matchScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileUploadResponse {
  message: string;
  filesUploaded: number;
  candidates: number[];
}

export const candidateSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  position: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
  matchScore: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CandidateInput = Omit<Candidate, "id" | "createdAt" | "updatedAt">; 
