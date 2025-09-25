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
import Assessments from "./pages/assignmentpage";
import AssessmentBuilderPage from "./pages/assesmentBuilder";
import CandidatesJob from "@/components/CandidateJob";
import AssessmentsJob from "@/components/AssessmentJob";

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
          <Route path="/jobs/:jobId/candidates" element={<CandidatesJob />} />
          <Route path="/jobs/:jobId/assessments" element={<AssessmentsJob />} />
          <Route path="/candidates" element={<CandidatesList/>} />
          <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
          <Route path="/assessments" element={<Assessments/>} />
          <Route path="/assessments/build/general" element={<AssessmentBuilderPage />} />
          <Route path="/assessments/build/:jobId" element={<AssessmentBuilderPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;