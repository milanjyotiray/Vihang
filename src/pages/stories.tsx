import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useRealtimeStories } from "@/hooks/use-realtime-stories";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StoryCard from "@/components/story-card";
import { Search } from "lucide-react";
import { Link } from "wouter";
import type { Story } from "@/lib/schema";

const indianStates = [
  "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
];

export default function Stories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("all");

  // Detect user's state on first load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const detectedState = data?.address?.state;
          if (detectedState) {
            // Find matching state name from our dropdown list
            const match = indianStates.find(
              (s) => s.toLowerCase() === detectedState.toLowerCase()
            );
            if (match) {
              setStateFilter(match.toLowerCase().replace(/\s+/g, "-"));
            }
          }
        } catch (err) {
          console.error("Error fetching location:", err);
        }
      });
    }
  }, []);

  // Enable real-time updates for stories
  useRealtimeStories();

  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories", categoryFilter === "all" ? "" : categoryFilter, stateFilter === "all" ? "" : stateFilter, searchQuery],
    queryFn: async () => {
      const { apiRequest } = await import('@/lib/queryClient');
      const response = await apiRequest('GET', '/api/stories');
      return response.json();
    },
    staleTime: 30000,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 mb-4">
              Community Stories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover stories from communities across India seeking support for education, health, livelihood, and social issues.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search stories by title, content, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-stories"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="livelihood">Livelihood</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-state-filter">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem
                    key={state}
                    value={state.toLowerCase().replace(/\s+/g, "-")}
                  >
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stories.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {stories.length} {stories.length === 1 ? 'story' : 'stories'} found
              </h2>
              <Link href="/submit">
                <Button className="bg-saffron hover:bg-saffron/90" data-testid="button-submit-story">
                  Share Your Story
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                No Stories Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || categoryFilter || stateFilter
                  ? "No stories match your current search criteria. Try adjusting your filters or search terms."
                  : "Be the first to share a story from your community!"
                }
              </p>
              <div className="space-y-3">
                <Link href="/submit">
                  <Button className="bg-saffron hover:bg-saffron/90 w-full" data-testid="button-submit-first-story">
                    Submit Your Story
                  </Button>
                </Link>
                {(searchQuery || (categoryFilter && categoryFilter !== "all") || (stateFilter && stateFilter !== "all")) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
                      setStateFilter("all");
                    }}
                    className="w-full"
                    data-testid="button-clear-filters"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
