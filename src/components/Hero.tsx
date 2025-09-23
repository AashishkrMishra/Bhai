import { Search, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Hero = () => {
  const trustedCompanies = [
    { name: "Microsoft", avatar: "M" },
    { name: "Google", avatar: "G" },
    { name: "Apple", avatar: "A" },
    { name: "Netflix", avatar: "N" },
    { name: "Spotify", avatar: "S" },
  ];

  return (
    <section className="min-h-screen bg-gradient-hero text-hero-foreground">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="text-2xl font-bold">HireFlow</div>
        {/* <div className="hidden md:flex items-center space-x-8">
          <a href="/home" className="hover:text-accent transition-colors">Home</a>
          <a href="#" className="hover:text-accent transition-colors">Find Talent</a>
          <a href="#" className="hover:text-accent transition-colors">ATS Dashboard</a>
          <a href="#" className="hover:text-accent transition-colors">Analytics</a>
          <a href="#" className="hover:text-accent transition-colors">Pricing</a>
        </div> */}
        <Button variant="secondary" className="bg-hero-foreground text-hero hover:bg-hero-foreground/90"><a href="/dashboard">
          Start Free Trial
          </a>
        </Button>
      </nav>

      {/* Hero Content */}
      <div className="px-6 lg:px-12 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Hire The Right Talent
                <br />
                Faster Than Ever
              </h1>
              <p className="text-xl text-hero-foreground/80 max-w-lg">
                Streamline your recruitment process with AI-powered tools, automated screening, and seamless candidate management.
              </p>
            </div>

            {/* Search Bar */}
            <Card className="p-6 bg-hero-foreground text-foreground shadow-strong">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Skills or role"
                    className="pl-10 border-border"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Location"
                    className="pl-10 border-border"
                  />
                </div>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Find Candidates
                </Button>
              </div>
            </Card>

            {/* Job Candidates */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {trustedCompanies.slice(0, 4).map((company, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full bg-hero-foreground text-hero flex items-center justify-center font-semibold border-2 border-hero"
                  >
                    {company.avatar}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-hero-foreground/80 text-hero flex items-center justify-center text-sm font-semibold border-2 border-hero">
                  +
                </div>
              </div>
              <div className="text-hero-foreground/80">
                <span className="font-semibold text-hero-foreground">2M+</span> Active Candidates
              </div>
            </div>

            {/* Trusted Companies */}
            <div className="space-y-4">
              <p className="text-hero-foreground/60 text-sm">Trusted by Leading Companies</p>
              <div className="grid grid-cols-5 gap-6">
                {trustedCompanies.map((company, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-hero-foreground/10 rounded-lg flex items-center justify-center mb-2 mx-auto">
                      <span className="text-hero-foreground font-semibold">{company.avatar}</span>
                    </div>
                    <p className="text-xs text-hero-foreground/60">{company.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Job Cards */}
          <div className="space-y-4">
            <Card className="p-6 bg-hero-foreground text-foreground shadow-medium">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sarah Chen</h3>
                    <p className="text-sm text-muted-foreground">UI/UX Designer • 5 years exp</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available immediately</span>
                  <span className="font-semibold text-success">$120k Expected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">Figma</span>
                  <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">Remote</span>
                  <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">Full-time</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-hero-foreground text-foreground shadow-medium">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Alex Rodriguez</h3>
                    <p className="text-sm text-muted-foreground">Frontend Developer • 3 years exp</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available in 2 weeks</span>
                  <span className="font-semibold text-success">$95k Expected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">React</span>
                  <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">TypeScript</span>
                  <span className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs">Full-time</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;