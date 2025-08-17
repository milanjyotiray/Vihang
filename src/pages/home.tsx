import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import StoryCard from "@/components/story-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { Story } from "@/lib/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories", categoryFilter === "all" ? "" : categoryFilter, stateFilter === "all" ? "" : stateFilter, searchQuery],
  });

  // Show only featured stories (first 6) on homepage
  const featuredStories = stories.slice(0, 6);

  return (
    <div className="bg-gray-50">
      {/* Independence Day Banner */}
      <div className="tricolor-gradient text-center py-2">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium text-gray-800">
            🇮🇳 Celebrating India's Independence Day - Share Your Story of Freedom & Change
          </p>
        </div>
      </div>

      <HeroSection />
      <StatsSection />
      
      {/* Featured Stories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 mb-4">
              Featured Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from communities across India, waiting for support and action.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-stories"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-category-filter">
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
              <SelectTrigger className="w-full sm:w-40" data-testid="select-state-filter">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="kolkata">Kolkata</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stories Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : featuredStories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No stories found matching your criteria.</p>
              <Link href="/submit">
                <Button className="bg-saffron hover:bg-saffron/90" data-testid="button-submit-first-story">
                  Submit the First Story
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/stories">
              <Button 
                className="bg-indian-green hover:bg-indian-green/90 text-white px-8 py-3" 
                data-testid="button-view-all-stories"
              >
                View All Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
