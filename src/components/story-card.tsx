import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Story } from "@/lib/schema";

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const [userLocation, setUserLocation] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Reverse geocoding API (Nominatim - free)
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || "";
            const state = data.address.state || "";
            setUserLocation(`${city}, ${state}`);
          } catch (error) {
            console.error("Error fetching location:", error);
            setUserLocation(null);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation(null);
        }
      );
    }
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "education":
        return "bg-blue-100 text-blue-800";
      case "health":
        return "bg-red-100 text-red-800";
      case "livelihood":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const formatDate = (date: string | Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    return `${Math.ceil(diffDays / 7)} weeks ago`;
  };

  const getStoryPreview = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const getDefaultImage = (category: string) => {
    const images = {
      education:
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      health:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      livelihood:
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      other:
        "https://images.unsplash.com/photo-1541844053589-346841d0b34c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    };
    return images[category as keyof typeof images] || images.other;
  };

  return (
    <Link href={`/story/${story.id}`}>
      <Card
        className="story-card overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg"
        data-testid={`card-story-${story.id}`}
      >
        <div className="w-full h-48 bg-gray-200">
          <img
            src={story.photoUrl || getDefaultImage(story.category)}
            alt={story.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getDefaultImage(story.category);
            }}
            data-testid={`img-story-${story.id}`}
          />
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge
              className={getCategoryColor(story.category)}
              data-testid={`badge-category-${story.category}`}
            >
              {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
            </Badge>
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span data-testid={`text-location-${story.id}`}>
                {userLocation || `${story.city}, ${story.state.charAt(0).toUpperCase() + story.state.slice(1)}`}
              </span>
            </span>
          </div>

          <h3
            className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
            data-testid={`text-title-${story.id}`}
          >
            {story.title}
          </h3>

          <p
            className="text-gray-600 text-sm mb-4 line-clamp-3"
            data-testid={`text-preview-${story.id}`}
          >
            {getStoryPreview(story.story)}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              <span data-testid={`text-date-${story.id}`}>
                {formatDate(story.createdAt)}
              </span>
            </span>
            <span className="text-saffron hover:text-saffron/80 text-sm font-medium transition-colors">
              Read More →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
