import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Eye, Calendar, MapPin, User } from "lucide-react";
import type { Story } from "@/lib/schema";

export default function AdminPage() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ["/api/admin/stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(story => ({
        ...story,
        createdAt: story.created_at,
        updatedAt: story.updated_at,
        photoUrl: story.photo_url,
        helpApproved: story.help_approved,
      }));
    },
  });

  const approveHelpMutation = useMutation({
    mutationFn: async (storyId: number) => {
      const { error } = await supabase
        .from('stories')
        .update({ help_approved: true })
        .eq('id', storyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({
        title: "Help Approved",
        description: "Story has been marked as helped successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve help.",
        variant: "destructive",
      });
    },
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "education": return "bg-blue-100 text-blue-800";
      case "health": return "bg-red-100 text-red-800";
      case "livelihood": return "bg-green-100 text-green-800";
      default: return "bg-purple-100 text-purple-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading stories...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage story approvals and help status</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stories List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>All Stories ({stories.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedStory?.id === story.id 
                        ? 'border-saffron bg-saffron/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedStory(story)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {story.title}
                      </h3>
                      <div className="flex gap-2">
                        {story.helpApproved && (
                          <Badge className="bg-green-100 text-green-800">
                            Help Approved
                          </Badge>
                        )}
                        <Badge className={getCategoryColor(story.category)}>
                          {story.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {story.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {story.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(story.createdAt)}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {story.story}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Story Details */}
          <div>
            {selectedStory ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">{selectedStory.title}</CardTitle>
                      <div className="flex gap-2 mb-4">
                        <Badge className={getCategoryColor(selectedStory.category)}>
                          {selectedStory.category}
                        </Badge>
                        {selectedStory.helpApproved && (
                          <Badge className="bg-green-100 text-green-800">
                            Help Approved
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900">{selectedStory.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedStory.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">City</label>
                      <p className="text-gray-900">{selectedStory.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">State</label>
                      <p className="text-gray-900">{selectedStory.state}</p>
                    </div>
                  </div>

                  {/* Story Content */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Story</label>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                      {selectedStory.story}
                    </p>
                  </div>

                  {/* Media */}
                  {selectedStory.photoUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Media</label>
                      <div className="mt-2">
                        {selectedStory.photoUrl.includes('video') || selectedStory.photoUrl.includes('.mp4') ? (
                          <video controls className="rounded-lg max-h-60 w-full">
                            <source src={selectedStory.photoUrl} />
                          </video>
                        ) : (
                          <img 
                            src={selectedStory.photoUrl} 
                            alt="Story media" 
                            className="rounded-lg max-h-60 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    {!selectedStory.helpApproved ? (
                      <Button
                        onClick={() => approveHelpMutation.mutate(selectedStory.id)}
                        disabled={approveHelpMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {approveHelpMutation.isPending ? "Approving..." : "Approve Help"}
                      </Button>
                    ) : (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Help Already Approved
                      </div>
                    )}
                    
                    <Button variant="outline" asChild>
                      <a href={`/story/${selectedStory.id}`} target="_blank">
                        <Eye className="w-4 h-4 mr-2" />
                        View Public Story
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-600">Select a story to view details and manage approval</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
