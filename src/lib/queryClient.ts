import { QueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { Story, InsertStory } from "@shared/schema";
import type { InsertTables } from "./supabase";

// Story service functions
export const storyService = {
  // Get all stories with optional filtering
  async getStories(filters?: {
    category?: string;
    state?: string;
    search?: string;
  }): Promise<Story[]> {
    let query = supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

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
    return (data || []).map((story) => ({
      ...story,
      photoUrl: story.photo_url || "",
      createdAt: story.created_at,
      updatedAt: story.updated_at,
    }));
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
  async submitContact(contact: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    try {
      console.log('Submitting contact with data:', contact);
      
      const { error } = await supabase.from("contacts").insert(contact);

      console.log('Contact submission response:', { error });

      if (error) {
        console.error('Contact submission error:', error);
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
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
