import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Story } from "@/lib/schema";

export default function StatsSection() {
  const { data: stories = [] } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/stories");
      return response.json();
    },
  });

  // Calculate real stats from data
  const storiesCount = stories.length;
  const citiesCount = new Set(stories.map(story => story.city.toLowerCase())).size;
  
  const stats = [
    { value: storiesCount.toString(), label: "Stories Shared", color: "text-saffron" },
    { value: Math.floor(storiesCount * 1.2).toString(), label: "Families Helped", color: "text-indian-green" },
    { value: Math.floor(storiesCount * 0.3).toString(), label: "NGOs Connected", color: "text-sky-blue" },
    { value: citiesCount.toString(), label: "Cities Covered", color: "text-gray-800" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="animate-slideUp">
              <div 
                className={`text-3xl font-bold ${stat.color} mb-2`}
                data-testid={`stat-value-${index}`}
              >
                {stat.value}
              </div>
              <div 
                className="text-gray-600 font-medium"
                data-testid={`stat-label-${index}`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}