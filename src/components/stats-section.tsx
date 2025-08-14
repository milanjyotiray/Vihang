export default function StatsSection() {
  const stats = [
    { value: "0", label: "Stories Shared", color: "text-saffron" },
    { value: "0", label: "Families Helped", color: "text-indian-green" },
    { value: "0", label: "NGOs Connected", color: "text-sky-blue" },
    { value: "0", label: "Cities Covered", color: "text-gray-800" },
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