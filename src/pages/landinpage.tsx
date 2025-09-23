import Hero from "@/components/Hero";
import JobCategories from "@/components/JobCategories";
import FeaturedJobs from "@/components/FeaturedJobs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <JobCategories />
      <FeaturedJobs />
      <Footer />
    </div>
  );
};

export default Index;
