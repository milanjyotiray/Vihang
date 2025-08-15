import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Story } from '@shared/schema';

// Contact type definition
interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

/**
 * Hook to subscribe to real-time updates for stories
 * Automatically updates React Query cache when stories are inserted, updated, or deleted
 */
export function useStoriesRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 Setting up real-time subscription for stories...');
    
    const channel = supabase
      .channel('stories_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'stories'
        },
        async (payload) => {
          console.log('📡 Real-time story event received:', payload.eventType, payload);

          try {
            if (payload.eventType === 'INSERT' && payload.new) {
              // Transform database format to app format
              const newStory: Story = {
                ...payload.new,
                photoUrl: payload.new.photo_url || '',
                createdAt: payload.new.created_at,
                updatedAt: payload.new.updated_at,
              } as Story;

              console.log('✅ New story added:', newStory.title);

              // Update all story-related queries in cache
              queryClient.setQueryData(['stories'], (oldData: Story[] | undefined) => {
                if (!oldData) return [newStory];
                // Add new story to the beginning of the list
                return [newStory, ...oldData];
              });

              // Update filtered story queries
              queryClient.invalidateQueries({ 
                queryKey: ['stories'], 
                exact: false // This will match all variants like ['stories', category, state, search]
              });
              
              // Also invalidate API-style queries for backward compatibility
              queryClient.invalidateQueries({ 
                queryKey: ['/api/stories'], 
                exact: false 
              });
              
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              // Transform database format to app format
              const updatedStory: Story = {
                ...payload.new,
                photoUrl: payload.new.photo_url || '',
                createdAt: payload.new.created_at,
                updatedAt: payload.new.updated_at,
              } as Story;

              console.log('🔄 Story updated:', updatedStory.title);

              // Update story in all relevant queries
              queryClient.setQueriesData(
                { queryKey: ['stories'], exact: false },
                (oldData: Story[] | undefined) => {
                  if (!oldData) return oldData;
                  return oldData.map(story => 
                    story.id === updatedStory.id ? updatedStory : story
                  );
                }
              );
              
              queryClient.invalidateQueries({ queryKey: ['/api/stories'], exact: false });
              
            } else if (payload.eventType === 'DELETE' && payload.old) {
              console.log('🗑️ Story deleted:', payload.old.id);

              // Remove story from all relevant queries
              queryClient.setQueriesData(
                { queryKey: ['stories'], exact: false },
                (oldData: Story[] | undefined) => {
                  if (!oldData) return oldData;
                  return oldData.filter(story => story.id !== payload.old.id);
                }
              );
              
              queryClient.invalidateQueries({ queryKey: ['/api/stories'], exact: false });
            }
            
            // Also refresh story count statistics
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            
          } catch (error) {
            console.error('❌ Error handling real-time story update:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Stories real-time subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('🔌 Cleaning up stories real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

/**
 * Hook to subscribe to real-time updates for contacts
 * Automatically updates React Query cache when contacts are inserted
 */
export function useContactsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 Setting up real-time subscription for contacts...');
    
    const channel = supabase
      .channel('contacts_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'contacts'
        },
        async (payload) => {
          console.log('📡 Real-time contact event received:', payload.eventType, payload);

          try {
            if (payload.eventType === 'INSERT' && payload.new) {
              console.log('✅ New contact submitted:', payload.new.subject);

              // Update contacts query cache if it exists
              queryClient.setQueryData(['contacts'], (oldData: Contact[] | undefined) => {
                if (!oldData) return [payload.new as Contact];
                return [payload.new as Contact, ...oldData];
              });

              // Invalidate contacts queries to refresh admin panels
              queryClient.invalidateQueries({ queryKey: ['contacts'] });
              
              // Update contact count statistics
              queryClient.invalidateQueries({ queryKey: ['stats'] });
              
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              console.log('🔄 Contact updated:', payload.new.id);

              // Update contact in cache
              queryClient.setQueriesData(
                { queryKey: ['contacts'], exact: false },
                (oldData: Contact[] | undefined) => {
                  if (!oldData) return oldData;
                  return oldData.map(contact => 
                    contact.id === payload.new.id ? payload.new as Contact : contact
                  );
                }
              );
              
            } else if (payload.eventType === 'DELETE' && payload.old) {
              console.log('🗑️ Contact deleted:', payload.old.id);

              // Remove contact from cache
              queryClient.setQueriesData(
                { queryKey: ['contacts'], exact: false },
                (oldData: Contact[] | undefined) => {
                  if (!oldData) return oldData;
                  return oldData.filter(contact => contact.id !== payload.old.id);
                }
              );
            }
            
          } catch (error) {
            console.error('❌ Error handling real-time contact update:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Contacts real-time subscription status:', status);
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('🔌 Cleaning up contacts real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

/**
 * Hook to set up all real-time subscriptions
 * Use this in your main App component to enable real-time updates across the app
 */
export function useRealtimeSubscriptions() {
  useStoriesRealtime();
  useContactsRealtime();
}
