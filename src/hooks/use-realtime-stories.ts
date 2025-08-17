import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useRealtimeStories() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('stories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stories',
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          // Invalidate and refetch stories queries
          queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
