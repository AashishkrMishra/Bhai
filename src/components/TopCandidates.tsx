// src/components/TopCandidates.tsx

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

// Define the expected Candidate data structure
type Candidate = {
  id: number;
  name: string;
  email: string;
  stage: "hired" | "rejected" | "offer" | "applied" | "interview";
  jobTitle: string;
};

// --- Helper functions for styling based on candidate stage ---
const getStatusStyles = (stage: Candidate["stage"]) => {
  switch (stage?.toLowerCase()) {
    case "hired":
      return { dot: "bg-green-500", badge: "bg-green-100 text-green-800" };
    case "rejected":
      return { dot: "bg-red-500", badge: "bg-red-100 text-red-800" };
    case "offer":
      return { dot: "bg-blue-500", badge: "bg-blue-100 text-blue-800" };
    case "interview":
      return { dot: "bg-purple-500", badge: "bg-purple-100 text-purple-800" };
    case "applied":
    default:
      return { dot: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-800" };
  }
};

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function TopCandidates() {
  const { data, isLoading, error } = useQuery<{ data: Candidate[] }>({
    queryKey: ["topCandidates"],
    queryFn: async () => {
      // Mock API delay to see the loader
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const res = await axios.get("/candidates");
      // Assuming the API returns an object with a 'data' property
      return res.data; 
    },
  });

  const candidates = data?.data?.slice(0, 6) || [];

  return (
    <Card className="shadow-sm border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-slate-700">Top Candidates</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
          </div>
        )}
        {error && (
          <p className="text-sm text-red-500 text-center h-48">Failed to load candidates.</p>
        )}
        {!isLoading && !error && (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {candidates.map((candidate) => {
              const styles = getStatusStyles(candidate.stage);
              return (
                <motion.div key={candidate.id} variants={itemVariants}>
                  <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50/80 transition-colors">
                    <span className={`h-2.5 w-2.5 rounded-full ${styles.dot} flex-shrink-0`}></span>
                    <div className="flex-grow">
                      <p className="font-semibold text-sm text-slate-800">{candidate.name}</p>
                      <p className="text-xs text-slate-500">{candidate.jobTitle}</p>
                    </div>
                    <Badge className={`capitalize ${styles.badge} hover:${styles.badge}`}>
                      {candidate.stage}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}