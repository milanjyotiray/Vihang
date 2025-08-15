import { QueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { Story, InsertStory } from "@shared/schema";
import type { InsertTables } from "./supabase";

// Story service functions
export const storyService = {
  // Get all stories with optional filtering and pagination
  async getStories(filters?: {
    category?: string;
    state?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ stories: Story[]; total: number; hasMore: boolean }> {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 12; // Default 12 items per page
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // First, get the total count for pagination info
    let countQuery = supabase
      .from("stories")
      .select("*", { count: 'exact', head: true });

    // Apply the same filters to count query
    if (filters?.category && filters.category !== "all" && filters.category !== "") {
      countQuery = countQuery.eq("category", filters.category as "education" | "health" | "livelihood" | "other");
    }

    if (filters?.state && filters.state !== "all" && filters.state !== "") {
      countQuery = countQuery.eq("state", filters.state);
    }

    if (filters?.search && filters.search.trim() !== "") {
      countQuery = countQuery.or(
        `title.ilike.%${filters.search}%,story.ilike.%${filters.search}%,city.ilike.%${filters.search}%`
      );
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      throw new Error(`Failed to count stories: ${countError.message}`);
    }

    // Now get the actual data with pagination
    let query = supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    // Apply filters
    if (filters?.category && filters.category !== "all" && filters.category !== "") {
      query = query.eq("category", filters.category as "education" | "health" | "livelihood" | "other");
    }

    if (filters?.state && filters.state !== "all" && filters.state !== "") {
      query = query.eq("state", filters.state);
    }

    if (filters?.search && filters.search.trim() !== "") {
      query = query.or(
        `title.ilike.%${filters.search}%,story.ilike.%${filters.search}%,city.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch stories: ${error.message}`);
    }

    // Transform database format to app format
    const stories = (data || []).map((story) => ({
      ...story,
      photoUrl: story.photo_url || "",
      createdAt: story.created_at,
      updatedAt: story.updated_at,
    }));

    const total = count || 0;
    const hasMore = (page * pageSize) < total;

    return {
      stories,
      total,
      hasMore
    };
  },

  // Get single story by ID
  async getStory(id: number): Promise<Story | null> {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Story not found
      }
      throw new Error(`Failed to fetch story: ${error.message}`);
    }

    // Transform database format to app format
    return {
      ...data,
      photoUrl: data.photo_url || "",
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  // Create new story
  async createStory(story: InsertStory): Promise<Story> {
    try {
      console.log('Creating story with data:', story);
      
      // Transform app format to database format
      const dbStory: InsertTables<"stories"> = {
        name: story.name,
        email: story.email,
        city: story.city,
        state: story.state,
        category: story.category,
        title: story.title,
        story: story.story,
        photo_url: story.photoUrl || null,
      };

      console.log('Transformed data for database:', dbStory);

      const { data, error } = await supabase
        .from("stories")
        .insert(dbStory)
        .select()
        .single();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Failed to create story: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from story creation');
      }

      // Transform database format to app format
      const result = {
        ...data,
        photoUrl: data.photo_url || "",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      console.log('Story created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in createStory:', error);
      throw error;
    }
  },
};

// Contact service functions
export const contactService = {
  // Get all contacts (for admin purposes)
  async getContacts(): Promise<{ id: number; name: string; email: string; subject: string; message: string; created_at: string; }[]> {
    try {
      console.log('Fetching contacts...');
      
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch contacts: ${error.message}`);
      }

      console.log('Contacts fetched successfully:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error in getContacts:', error);
      throw error;
    }
  },

  async submitContact(contact: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    try {
      console.log('Submitting contact with data:', contact);
      
      // Try to insert with RLS bypass by adding created_at explicitly
      const contactWithTimestamp = {
        ...contact,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from("contacts")
        .insert(contactWithTimestamp);

      console.log('Contact submission response:', { error });

      if (error) {
        console.error('Contact submission error:', error);
        
        // If RLS policy error, provide helpful feedback
        if (error.code === '42501') {
          throw new Error('Contact form is temporarily unavailable. Please email us directly at contact.vihang@gmail.com');
        }
        
        throw new Error(`Failed to submit contact form: ${error.message}`);
      }

      console.log('Contact submitted successfully');
    } catch (error) {
      console.error('Error in submitContact:', error);
      throw error;
    }
  },
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes - longer cache
      gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
      retry: 1,
      refetchOnReconnect: false, // Reduce unnecessary network calls
    },
    mutations: {
      retry: false,
    },
  },
  logger: {
    // Reduce console logging in production
    log: import.meta.env.DEV ? console.log : () => {},
    warn: import.meta.env.DEV ? console.warn : () => {},
    error: console.error,
  },
});
