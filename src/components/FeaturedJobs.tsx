import { MapPin, Clock, DollarSign, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FeaturedJobs = () => {
  const candidates = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior UI/UX Designer",
      experience: "5 years experience",
      availability: "Available now",
      salary: "$120k Expected",
      location: "Remote",
      tags: ["Figma", "Prototyping"],
      avatar: "SC",
      featured: true,
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Frontend Developer",
      experience: "4 years experience",
      availability: "2 weeks notice",
      salary: "$95k Expected",
      location: "San Francisco, CA",
      tags: ["React", "TypeScript"],
      avatar: "MR",
      featured: true,
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Product Manager",
      experience: "6 years experience",
      availability: "Available now",
      salary: "$140k Expected",
      location: "New York, NY",
      tags: ["Strategy", "Analytics"],
      avatar: "EJ",
      featured: false,
    },
    {
      id: 4,
      name: "David Kim",
      role: "DevOps Engineer",
      experience: "3 years experience",
      availability: "1 month notice",
      salary: "$110k Expected",
      location: "Seattle, WA",
      tags: ["AWS", "Docker"],
      avatar: "DK",
      featured: true,
    },
    {
      id: 5,
      name: "Jessica Wang",
      role: "Data Scientist",
      experience: "4 years experience",
      availability: "Available now",
      salary: "$125k Expected",
      location: "Austin, TX",
      tags: ["Python", "ML"],
      avatar: "JW",
      featured: false,
    },
    {
      id: 6,
      name: "Alex Thompson",
      role: "Mobile Developer",
      experience: "5 years experience",
      availability: "3 weeks notice",
      salary: "$115k Expected",
      location: "Los Angeles, CA",
      tags: ["React Native", "Swift"],
      avatar: "AT",
      featured: false,
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Featured Candidates
            </h2>
            <p className="text-muted-foreground text-lg">
              Pre-screened professionals ready to join your team
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            Browse All Candidates
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="p-6 hover:shadow-medium transition-all duration-300 group bg-card border-border"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{candidate.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{candidate.role}</p>
                    </div>
                  </div>
                  {candidate.featured && (
                    <Badge variant="secondary" className="bg-success text-success-foreground">
                      Top Talent
                    </Badge>
                  )}
                </div>

                {/* Candidate Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{candidate.experience}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-success font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{candidate.salary}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{candidate.availability}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {candidate.tags.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                >
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Explore Talent Pool
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;