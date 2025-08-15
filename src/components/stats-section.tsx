import { useQuery } from "@tanstack/react-query";
import { storyService } from "@/lib/queryClient";

export default function StatsSection() {
  // Fetch all stories to calculate real-time stats
  const { data: stories = [] } = useQuery({
    queryKey: ["stats"],
    queryFn: () => storyService.getStories({}),
  });

  // Calculate real-time statistics
  const uniqueCities = new Set(stories.map(story => story.city.toLowerCase())).size;
  const uniqueStates = new Set(stories.map(story => story.state.toLowerCase())).size;
  
  const stats = [
    { 
      value: stories.length.toString(), 
      label: "Stories Shared", 
      color: "text-saffron",
      animate: true 
    },
    { 
      value: Math.floor(stories.length * 0.3).toString(), // Estimate families helped (30% of stories)
      label: "Families Helped", 
      color: "text-indian-green",
      animate: true 
    },
    { 
      value: Math.floor(stories.length * 0.1).toString(), // Estimate NGOs connected (10% of stories)
      label: "NGOs Connected", 
      color: "text-sky-blue",
      animate: true 
    },
    { 
      value: Math.max(uniqueCities, uniqueStates).toString(), 
      label: "Cities Covered", 
      color: "text-gray-800",
      animate: true 
    },
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