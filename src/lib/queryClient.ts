import { QueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds for faster updates
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 1,
    },
  },
});

// Supabase API functions
export async function apiRequest(method: string, endpoint: string, data?: any) {
  try {
    if (method === "GET") {
      if (endpoint === "/api/stories") {
        const { data: stories, error } = await supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        // Normalize to Story schema shape (camelCase)
        const normalized = (stories || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          city: s.city,
          state: s.state,
          category: s.category,
          title: s.title,
          story: s.story,
          photoUrl: s.photo_url ?? null,
          createdAt: s.created_at,
          updatedAt: s.updated_at,
          featured: Boolean(s.featured ?? false),
          verified: Boolean(s.verified ?? false),
          helpApproved: Boolean(s.help_approved ?? false),
        }));
        return { json: async () => normalized };
      }
      
      if (endpoint.startsWith("/api/stories/")) {
        const id = endpoint.split("/").pop();
        const { data: story, error } = await supabase
          .from('stories')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        const normalized = story
          ? {
              id: story.id,
              name: story.name,
              email: story.email,
              city: story.city,
              state: story.state,
              category: story.category,
              title: story.title,
              story: story.story,
              photoUrl: story.photo_url ?? null,
              createdAt: story.created_at,
              updatedAt: story.updated_at,
              featured: Boolean(story.featured ?? false),
              verified: Boolean(story.verified ?? false),
              helpApproved: Boolean(story.help_approved ?? false),
            }
          : null;
        return { json: async () => normalized };
      }
    }
    
    if (method === "POST") {
      if (endpoint === "/api/stories") {
        const { data: story, error } = await supabase
          .from('stories')
          .insert([{
            name: data.name,
            email: data.email,
            city: data.city,
            state: data.state,
            category: data.category,
            title: data.title,
            story: data.story,
            photo_url: data.photoUrl || null,
          }])
          .select()
          .single();
        
        if (error) throw error;
        const normalized = story
          ? {
              id: story.id,
              name: story.name,
              email: story.email,
              city: story.city,
              state: story.state,
              category: story.category,
              title: story.title,
              story: story.story,
              photoUrl: story.photo_url ?? null,
              createdAt: story.created_at,
              updatedAt: story.updated_at,
              featured: Boolean(story.featured ?? false),
              verified: Boolean(story.verified ?? false),
              helpApproved: Boolean(story.help_approved ?? false),
            }
          : null;
        return { json: async () => normalized };
      }
      
      if (endpoint === "/api/ngos") {
        const { data: ngo, error } = await supabase
          .from('ngos')
          .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone,
            website: data.website || null,
            description: data.description,
            focus_areas: data.focusAreas,
            city: data.city,
            state: data.state,
          }])
          .select()
          .single();
        
        if (error) throw error;
        return { json: async () => ngo };
      }
    }
    
    throw new Error(`API endpoint ${endpoint} not found`);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
