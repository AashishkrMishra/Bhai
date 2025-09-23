import { Code, Palette, Shield, TrendingUp, Users, Wrench, Heart, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

const JobCategories = () => {
  const features = [
    {
      icon: Users,
      title: "AI Candidate Screening",
      count: "Smart resume analysis",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      count: "Real-time hiring insights",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Code,
      title: "ATS Integration",
      count: "Seamless workflow",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Heart,
      title: "Video Interviews",
      count: "Built-in interview platform",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Shield,
      title: "Compliance Tools",
      count: "GDPR & EEOC compliant",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Wrench,
      title: "Custom Workflows",
      count: "Tailored hiring process",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: Palette,
      title: "Branded Career Page",
      count: "Attract top talent",
      color: "bg-pink-50 text-pink-600",
    },
    {
      icon: Globe,
      title: "Global Talent Pool",
      count: "2M+ active candidates",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Everything You Need
            <br />
            <span className="text-primary">To Hire Better</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-medium transition-all duration-300 cursor-pointer group bg-gradient-card border-border"
            >
              <div className="space-y-4">
                <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.count}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;