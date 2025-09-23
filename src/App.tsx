import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landinpage";
import Dashboard from "./pages/dashboard";
import Jobs from "./pages/jobs"
import JobDetails from "./pages/jobDetails";
import NotFound from "./pages/NotFound";
import CandidatesList from "./pages/candidateList";
import CandidateProfile from "./pages/candidateProfile";
import Assignments from "./pages/assignmentpage";
import AssessmentBuilderPage from "./pages/assesmentBuilder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/candidates" element={<CandidatesList/>} />
          <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
          <Route path="/assignments" element={<Assignments/>} />
          <Route path="/assignments/build/general" element={<AssessmentBuilderPage/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
