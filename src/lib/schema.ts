import { z } from "zod";

// Story schema
export const insertStorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  category: z.string().min(1, "Category is required"),
  title: z.string().min(1, "Title is required"),
  story: z.string().min(1, "Story is required"),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export const storySchema = insertStorySchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
});

// NGO schema
export const insertNgoSchema = z.object({
  name: z.string().min(1, "NGO name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().min(1, "Description is required"),
  focusAreas: z.array(z.string()).min(1, "At least one focus area is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

export const ngoSchema = insertNgoSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  verified: z.boolean().default(false),
});

// Types
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = z.infer<typeof storySchema>;
export type InsertNgo = z.infer<typeof insertNgoSchema>;
export type Ngo = z.infer<typeof ngoSchema>;
