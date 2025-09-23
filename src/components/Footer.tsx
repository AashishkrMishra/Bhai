import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Star, ChevronLeft, ChevronRight } from "lucide-react";

const Footer = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "HR Director",
      company: "TechCorp",
      avatar: "SM",
      review: "HireFlow has transformed our hiring process. The AI-powered matching algorithm is spot on and the qualified candidates we receive save us hours of screening time.",
      rating: 5,
    },
    {
      id: 2,
      name: "David Chen",
      role: "Talent Acquisition Manager", 
      company: "StartupXYZ",
      avatar: "DC",
      review: "The platform's user-friendly interface and comprehensive candidate profiles make the process of finding relevant applicants for a breeze.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "People Operations Lead",
      company: "GrowthCo",
      avatar: "ER", 
      review: "What sets HireFlow apart is its commitment to user engagement and support. The helpful HR insights and data-driven perspectives improve our hiring decisions.",
      rating: 5,
    },
  ];

  return (
    <footer className="bg-background">
      {/* Testimonials Section */}
      <section className="py-20 px-6 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground">
              Review of HR Teams Who<br />
              Have Streamlined Hiring
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="w-12 h-12 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 bg-card border-border">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.review}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                Get Matched The Most<br />
                Qualified Candidates, Just Post<br />
                Your Job at HireFlow
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                In the subject line of your email, write your name, the description of the 
                position and the reference number. If you did not find the vacancy on the 
                HireFlow platform, it's helpful to state where you found it.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Post Job Now
              </Button>
            </div>
            
            <div className="bg-card border-2 border-dashed border-border rounded-lg p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">Upload Job Description</h3>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">
                  <Button variant="link" className="text-primary p-0 h-auto font-normal">
                    Browse
                  </Button> or Drag your Job Description here
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 lg:px-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Never Want to Miss<br />
                Any Talent Updates?
              </h2>
              <p className="text-primary-foreground/80">
                Get the latest insights on hiring trends and candidate availability.
              </p>
            </div>
            <div className="flex space-x-4">
              <Input 
                placeholder="Email Address" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section className="py-16 px-6 lg:px-12 bg-accent text-accent-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4">HireFlow</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                HireFlow is a global leader in connecting 
                HR teams and top talent every day. Our AI-powered 
                platform simplifies recruitment.
              </p>
            </div>

            {/* HR Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-accent-foreground">HR Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Post Jobs</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Search Talent</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Candidate Analytics</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Interview Scheduling</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Applicant Tracking</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Help</a></li>
              </ul>
            </div>

            {/* For Companies */}
            <div>
              <h4 className="font-semibold mb-4 text-accent-foreground">For Companies</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Enterprise Solutions</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Bulk Hiring</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">API Access</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Help</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 text-accent-foreground">Support & Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent-foreground transition-colors">About HireFlow</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Work for HireFlow</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Privacy Center</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Security Center</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Ad Choices</a></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4 text-accent-foreground">Social Media</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-accent-foreground transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">
                © Copyright HireFlow. All Rights Reserved
              </p>
              <div className="flex space-x-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-accent-foreground transition-colors">Terms & Conditions of Use</a>
                <a href="#" className="hover:text-accent-foreground transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-accent-foreground transition-colors">Privacy Notice</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;