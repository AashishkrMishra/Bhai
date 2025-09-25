import { useEffect } from 'react';
import { Briefcase, MapPin, Search, Users, TrendingUp, Code, Heart, Shield, Wrench, Palette, Globe, Star, ChevronLeft, ChevronRight, Upload } from 'lucide-react';

// Main App Component
export default function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-stone-50 text-stone-800 font-sans">
      <Style />
      <div className="min-h-screen">
        <Hero />
        <JobCategories />
        <FeaturedJobs />
        <Footer />
      </div>
    </div>
  );
}

// Inline Styles Component
const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* --- Hero Section Mouse Spotlight Effect --- */
    .hero-bg {
      background-color: #f8fafc;
      background-image: 
        radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(13, 148, 136, 0.25), transparent 80%),
        radial-gradient(circle at 100% 0, #ccfbf1 0%, #f8fafc 40%),
        radial-gradient(circle at 0% 100%, #ccfbf1 0%, #f8fafc 30%);
      transition: background 0.6s ease-out;
    }
    
    /* --- Glossy Card Effect --- */
    .glass-card {
      background: rgba(255, 255, 255, 0.6);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
      transition: all 0.3s ease;
    }

    .glass-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 16px 40px 0 rgba(31, 38, 135, 0.15);
      background: rgba(255, 255, 255, 0.8);
    }
    
    /* --- Enhanced Primary Button --- */
    .primary-btn {
        background-image: linear-gradient(45deg, #14b8a6, #0d9488);
        color: white;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px -3px rgba(13, 148, 136, 0.3);
    }
    .primary-btn:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 10px 20px -5px rgba(13, 148, 136, 0.4);
    }

    /* --- Section Backgrounds for Glossy Effect --- */
    .section-bg {
      background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
    }

    /* --- Animation Keyframes --- */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes scroller {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    
    /* NEW: Text Reveal Animation */
    @keyframes reveal {
      from {
        clip-path: inset(0 100% 0 0);
      }
      to {
        clip-path: inset(0 0 0 0);
      }
    }

    /* --- Animation Utility Classes --- */
    .fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
    }

    .animate-scale-in {
      animation: scaleIn 0.7s ease-out forwards;
      opacity: 0;
    }
    
    .scroller {
      animation: scroller 40s linear infinite;
    }
    
    .scroller-container:hover .scroller {
      animation-play-state: paused;
    }

    /* NEW: Text Reveal Class */
    .text-reveal {
      animation: reveal 1s cubic-bezier(0.77, 0, 0.175, 1) forwards;
      animation-delay: inherit;
    }
    
    .feature-icon-hover:hover {
       transform: scale(1.1);
       filter: drop-shadow(0 0 15px rgba(13, 148, 136, 0.5));
    }

  `}</style>
);

// Hero Component
const Hero = () => {
  const trustedCompanies = [
    { name: "Microsoft", avatar: "M" },
    { name: "Google", avatar: "G" },
    { name: "Apple", avatar: "A" },
    { name: "Netflix", avatar: "N" },
    { name: "Spotify", avatar: "S" },
    { name: "Amazon", avatar: "A" },
    { name: "Meta", avatar: "M" },
  ];

  return (
    <section className="relative min-h-screen hero-bg text-stone-800 overflow-hidden flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12 z-10">
        <div className="text-3xl font-bold tracking-tight text-stone-900">TalentFlow</div>
        <a href="/dashboard">
          <button className="hidden sm:block primary-btn">
            Start Free Trial
          </button>
        </a>
      </nav>

      {/* Hero Content */}
      <div className="flex-grow flex items-center px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 leading-tight mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-reveal inline-block" style={{ animationDelay: '0.5s' }}>Find Your Next</span><br /> 
            <span className="text-teal-600 text-reveal inline-block" style={{ animationDelay: '0.8s' }}>Talent</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 fade-in-up" style={{ animationDelay: '1s' }}>
            The all-in-one hiring platform designed to help you find, interview, and hire the best talent, faster than ever.
          </p>
          <div className="fade-in-up flex justify-center items-center gap-4" style={{ animationDelay: '1.2s' }}>
            <a href="/jobs">
              <button className="primary-btn text-lg">
                Post Jobs Now
              </button>
            </a>
             <a href="/dashboard" className="sm:hidden">
                <button className="bg-white border border-stone-300 text-stone-700 font-semibold py-3 px-6 rounded-lg text-lg hover:bg-stone-50 transition-colors duration-300 shadow-sm">
                  Start Trial
                </button>
            </a>
          </div>
        </div>
      </div>

      {/* Trusted Companies Scroller */}
      <div className="px-6 lg:px-12 py-12 z-10">
          <div className="max-w-5xl mx-auto text-center fade-in-up" style={{ animationDelay: '1.4s' }}>
            <p className="text-stone-500 text-sm font-semibold tracking-wider mb-6">
              TRUSTED BY LEADING COMPANIES
            </p>
            <div className="scroller-container relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
              <div className="scroller flex items-center space-x-12">
                {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
                  <div key={index} className="flex-shrink-0 text-center group w-24">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2 mx-auto glass-card border-none group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                      <span className="text-2xl font-bold">{company.avatar}</span>
                    </div>
                    <p className="text-xs text-stone-500 font-semibold group-hover:text-teal-600 transition-colors duration-300">{company.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </section>
  );
};

// Job Categories (Features) Component
const JobCategories = () => {
    const features = [
        { icon: Users, title: "AI Candidate Screening", description: "Smart resume analysis to find the best matches.", color: "text-teal-500", bgColor: "bg-teal-50" },
        { icon: TrendingUp, title: "Analytics Dashboard", description: "Real-time hiring insights and performance tracking.", color: "text-sky-500", bgColor: "bg-sky-50" },
        { icon: Code, title: "ATS Integration", description: "Seamlessly integrate with your existing applicant tracking system.", color: "text-emerald-500", bgColor: "bg-emerald-50" },
        { icon: Heart, title: "Video Interviews", description: "Conduct live or asynchronous video interviews on-platform.", color: "text-rose-500", bgColor: "bg-rose-50" },
        { icon: Shield, title: "Compliance Tools", description: "Ensure your hiring process is GDPR & EEOC compliant.", color: "text-amber-500", bgColor: "bg-amber-50" },
        { icon: Wrench, title: "Custom Workflows", description: "Tailor the hiring process to fit your company's unique needs.", color: "text-cyan-500", bgColor: "bg-cyan-50" },
    ];
  return (
    <section className="py-20 px-6 lg:px-12 section-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4 fade-in-up">
            A Smarter Way to Hire
          </h2>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
            Our powerful features are designed to streamline every step of your recruitment process, from sourcing to signing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 text-center glass-card rounded-2xl animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${feature.bgColor} mb-6 transition-all duration-300 feature-icon-hover`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-stone-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Jobs (Candidates) Component
const FeaturedJobs = () => {
    const candidates = [
        { name: "Sarah Chen", role: "Senior UI/UX Designer", location: "Remote", tags: ["Figma", "Prototyping"], avatarColor: "bg-teal-500" },
        { name: "Michael Rodriguez", role: "Frontend Developer", location: "San Francisco, CA", tags: ["React", "TypeScript"], avatarColor: "bg-sky-500" },
        { name: "Emily Johnson", role: "Product Manager", location: "New York, NY", tags: ["Strategy", "Analytics"], avatarColor: "bg-emerald-500" },
    ];
  return (
    <section className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4 fade-in-up">
              Meet Top Talent
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
              A curated selection of pre-screened professionals ready for their next challenge.
            </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          {candidates.map((candidate, index) => (
            <div 
              key={index} 
              className="glass-card rounded-2xl p-6 animate-scale-in"
              style={{ animationDelay: `${index * 100 + 100}ms` }}
            >
              <div className="flex items-center space-x-4 mb-5">
                <div className={`w-14 h-14 rounded-full ${candidate.avatarColor} flex-shrink-0 flex items-center justify-center text-xl font-bold text-white`}>
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-stone-900">{candidate.name}</h3>
                  <p className="text-stone-600">{candidate.role}</p>
                </div>
              </div>
              <div className="flex items-center text-stone-500 text-sm space-x-4 mb-4">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" />{candidate.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {candidate.tags.map((tag, i) => (
                  <span key={i} className="bg-stone-200 text-stone-700 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
    const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "HR Director, TechCorp",
      avatarColor: "bg-teal-500",
      review: "TalentFlow has transformed our hiring process. The AI-powered matching is spot on and saves us hours of screening time.",
      rating: 5,
    },
    {
      id: 2,
      name: "David Chen",
      role: "Talent Manager, StartupXYZ", 
      avatarColor: "bg-sky-500",
      review: "The user-friendly interface and comprehensive candidate profiles make finding relevant applicants a breeze.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "People Ops, GrowthCo",
      avatarColor: "bg-emerald-500",
      review: "What sets TalentFlow apart is its commitment to support and the helpful, data-driven insights that improve our hiring decisions.",
      rating: 5,
    },
  ];

  return (
    <footer className="bg-white border-t border-stone-200">
      {/* Testimonials Section */}
      <section className="py-20 px-6 lg:px-12 section-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4 fade-in-up">
              Loved by HR Teams Worldwide
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
              See what professionals are saying about our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="glass-card rounded-2xl p-8 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                 <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed">
                  "{testimonial.review}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${testimonial.avatarColor} flex-shrink-0 flex items-center justify-center text-lg font-bold text-white`}>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900">{testimonial.name}</h4>
                    <p className="text-sm text-stone-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer Links */}
      <section className="py-16 px-6 lg:px-12 bg-stone-100">
        <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="md:col-span-1">
                  <h3 className="text-2xl font-bold mb-4">TalentFlow</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    A global leader in connecting HR teams with top talent. Our AI-powered platform simplifies recruitment.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="font-semibold mb-4 text-stone-800">Quick Links</h4>
                  <ul className="space-y-3 text-sm text-stone-500">
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Post Jobs</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Search Talent</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">About Us</a></li>
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="font-semibold mb-4 text-stone-800">Resources</h4>
                  <ul className="space-y-3 text-sm text-stone-500">
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Integrations</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">API Access</a></li>
                  </ul>
                </div>

                 {/* Legal */}
                <div>
                  <h4 className="font-semibold mb-4 text-stone-800">Legal</h4>
                  <ul className="space-y-3 text-sm text-stone-500">
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Terms of Use</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Security</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition-colors">Ad Choices</a></li>
                  </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="py-6 px-6 lg:px-12 bg-stone-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-stone-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TalentFlow. All Rights Reserved.
          </p>
          <div className="flex space-x-6 text-stone-500 text-sm">
            <a href="#" className="hover:text-teal-600 transition-colors">Facebook</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-teal-600 transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

