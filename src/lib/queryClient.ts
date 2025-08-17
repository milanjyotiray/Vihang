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
        console.log('Fetched stories:', stories);
        return { json: async () => stories || [] };
      }
      
      if (endpoint.startsWith("/api/stories/")) {
        const id = endpoint.split("/").pop();
        const { data: story, error } = await supabase
          .from('stories')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return { json: async () => story };
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
        return { json: async () => story };
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
