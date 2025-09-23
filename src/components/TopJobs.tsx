// src/components/TopJobs.tsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type Job = {
  id: number;
  title: string;
  tags: string[];
};

// Animation variants for the list container and its items
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

export default function TopJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        // Mock API delay to demonstrate loading state
        await new Promise(resolve => setTimeout(resolve, 500)); 
        const res = await fetch("/jobs?page=1&pageSize=6&status=active");
        const result = await res.json();
        setJobs(result.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <Card className="shadow-sm border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-slate-700">Recent Job Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
          </div>
        )}
        {!loading && jobs.length === 0 && (
          <p className="text-sm text-slate-500 text-center h-48">No recent jobs found.</p>
        )}
        {!loading && jobs.length > 0 && (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50/80 transition-colors"
              >
                <h3 className="font-semibold text-sm text-slate-800 truncate">
                  {job.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}