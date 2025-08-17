import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Mail, Share2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Story } from "@/lib/schema";

export default function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: story, isLoading, error } = useQuery<Story>({
    queryKey: ["/api/stories", id],
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "education": return "bg-blue-100 text-blue-800";
      case "health": return "bg-red-100 text-red-800";
      case "livelihood": return "bg-green-100 text-green-800";
      default: return "bg-purple-100 text-purple-800";
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.ceil(diffDays / 7)} weeks ago`;
  };

  const shareStory = () => {
    if (navigator.share && story) {
      navigator.share({
        title: story.title,
        text: `Check out this story from ${story.city}, ${story.state}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Story link has been copied to your clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
          <Card>
            <CardHeader className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Story Not Found</h1>
            <p className="text-gray-600 mb-6">
              The story you're looking for doesn't exist or may have been removed.
            </p>
            <Link href="/stories">
              <Button data-testid="button-browse-stories">Browse All Stories</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Navigation */}
        <Link href="/stories">
          <Button variant="ghost" className="mb-6 p-0 hover:bg-transparent" data-testid="button-back-to-stories">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Button>
        </Link>

        {/* Story Content */}
        <Card className="overflow-hidden">
          {story.photoUrl && (
            <div className="w-full h-64 bg-gray-200">
              <img
                src={story.photoUrl}
                alt={story.title}
                className="w-full h-full object-cover"
                data-testid="img-story-photo"
              />
            </div>
          )}

          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight" data-testid="text-story-title">
                {story.title}
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={shareStory}
                className="flex-shrink-0"
                data-testid="button-share-story"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <Badge className={getCategoryColor(story.category)} data-testid={`badge-category-${story.category}`}>
                {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
              </Badge>
              
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span data-testid="text-location">{story.city}, {story.state}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span data-testid="text-date">{formatDate(story.createdAt)}</span>
              </div>
            </div>

            <div className="border-l-4 border-saffron bg-saffron/5 p-4 rounded-r-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Story ID:</strong> 
                <span className="font-mono text-saffron ml-2" data-testid="text-story-id">{story.id}</span>
              </p>
              <p className="text-xs text-gray-500">
                NGOs and volunteers can reference this ID when reaching out to help.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">The Story</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" data-testid="text-story-content">
                  {story.story}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span data-testid="text-contact-name">{story.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a 
                    href={`mailto:${story.email}?subject=Regarding your story: ${story.title}`}
                    className="text-saffron hover:text-saffron/80 transition-colors"
                    data-testid="link-contact-email"
                  >
                    {story.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-indian-green/5 border border-indian-green/20 p-4 rounded-lg">
              <h4 className="font-semibold text-indian-green mb-2">Want to Help?</h4>
              <p className="text-sm text-gray-700 mb-4">
                If you're an NGO, volunteer, or organization that can assist with this story, 
                please reach out directly to the story author or contact our team.
              </p>
              <div className="flex gap-3">
                <a
                  href={`mailto:${story.email}?subject=Offering Help for: ${story.title}`}
                  className="text-indian-green hover:text-indian-green/80 font-medium text-sm"
                  data-testid="link-help-directly"
                >
                  Contact Directly →
                </a>
                <Link href="/contact">
                  <Button 
                    variant="link" 
                    className="text-indian-green hover:text-indian-green/80 p-0 h-auto text-sm"
                    data-testid="button-join-network"
                  >
                    Join Our Network →
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
