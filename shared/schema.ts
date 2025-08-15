import { z } from "zod";

// Story categories
export const storyCategories = ["education", "health", "livelihood", "other"] as const;

// Base story schema
export const storySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  category: z.enum(storyCategories),
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  story: z.string().min(50, "Story must be at least 50 characters").max(1500, "Story must be less than 1500 characters"),
  photoUrl: z.string().url().optional().or(z.literal("")),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  featured: z.boolean().default(false),
  verified: z.boolean().default(false),
});

// Insert story schema (for creating new stories)
export const insertStorySchema = storySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  featured: true,
  verified: true,
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

// Types
export type Story = z.infer<typeof storySchema>;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Contact = z.infer<typeof contactSchema>;
export type StoryCategory = typeof storyCategories[number];
