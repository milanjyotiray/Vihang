import { Button } from "@/components/ui/button";
import { Feather, BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-sky-blue/20 to-white py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideUp">
            <div className="mb-6">
              <span className="inline-block bg-saffron/10 text-saffron px-4 py-2 rounded-full text-sm font-medium mb-4">
                Community Stories Platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold text-gray-900 leading-tight">
                Give Wings to a <span className="text-saffron">Story</span>.<br />
                Bring <span className="text-indian-green">Change</span>.
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Share your community's real-life struggles and needs. Connect with NGOs and volunteers ready to make a difference in education, health, livelihood, and social issues.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
              <Link href="/submit">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-saffron to-orange-500 hover:from-saffron/90 hover:to-orange-500/90 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all"
                  data-testid="button-submit-story-hero"
                >
                  <Feather className="w-5 h-5 mr-2" />
                  Submit Your Story
                </Button>
              </Link>
              <Link href="/stories">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-indian-green text-indian-green hover:bg-indian-green hover:text-white px-8 py-4 text-lg transition-all"
                  data-testid="button-browse-stories-hero"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Stories
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-float">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Community gathering with people sharing stories"
              className="rounded-2xl shadow-2xl"
              data-testid="img-hero-community"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="text-2xl font-bold text-saffron" data-testid="text-hero-stats">0</div>
              <div className="text-sm text-gray-600">Stories Shared</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}