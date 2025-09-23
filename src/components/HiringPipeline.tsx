// src/components/HiringPipeline.tsx

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";

type Candidate = {
  stage: "applied" | "screen" | "tech" | "offer" | "hired";
};

const funnelStages: Candidate['stage'][] = ["applied", "screen", "tech", "offer", "hired"];

const stageColors: Record<Candidate['stage'], string> = {
  applied: "bg-indigo-500",
  screen: "bg-purple-500",
  tech: "bg-blue-500",
  offer: "bg-sky-500",
  hired: "bg-teal-500",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function HiringPipeline() {
  const { data, isLoading } = useQuery<{ data: Candidate[] }>({
    queryKey: ["allCandidatesPipeline"],
    queryFn: async () => (await axios.get("/candidates")).data,
  });

  const pipelineData = funnelStages.map(stage => {
    const count = data?.data.filter(c => c.stage === stage).length || 0;
    return { name: stage, count };
  });

  // ## FIXED: Calculate width relative to the max count to prevent overflow ##
  const maxCount = Math.max(...pipelineData.map(p => p.count), 1);

  return (
    <Card className="shadow-sm border-slate-200 bg-white">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-slate-600"/>
            </div>
            <div>
                <CardTitle className="text-slate-700">Hiring Pipeline</CardTitle>
                <CardDescription>Candidate distribution across stages</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
          </div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {pipelineData.map(stage => {
              const widthPercentage = (stage.count / maxCount) * 100;

              return (
                <motion.div key={stage.name} variants={itemVariants}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="capitalize font-medium text-slate-600">{stage.name}</span>
                    <span className="font-bold text-slate-800">{stage.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${stageColors[stage.name]} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${widthPercentage}%` }}
                    />
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