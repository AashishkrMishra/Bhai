import { useState } from "react";
import { motion } from "framer-motion";
import StageColumn from "@/components/StageColumn"; 
import { Candidate, CandidateStage } from "@/mock/db";
import { useCandidates } from "@/hooks/useCandidates";

// This component receives filtered candidates from its parent page
export default function KannuBannu({ candidates }: { candidates: Candidate[] }) {
  const { loading, updateStage } = useCandidates();
  const [dragged, setDragged] = useState<Candidate | null>(null);

  const handleDrop = (e: React.DragEvent, stage: CandidateStage) => {
    e.preventDefault();
    if (dragged && dragged.stage !== stage) {
      updateStage(dragged.id!, stage);
    }
    setDragged(null);
  };

  const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
    setDragged(candidate);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const stages: { stage: CandidateStage; color: string; name: string }[] = [
    { stage: "applied", color: "bg-slate-400", name: "Applied" },
    { stage: "screen", color: "bg-orange-400", name: "Screen" },
    { stage: "tech", color: "bg-purple-400", name: "Tech Interview" },
    { stage: "offer", color: "bg-sky-400", name: "Offer" },
    { stage: "hired", color: "bg-green-400", name: "Hired" },
    { stage: "rejected", color: "bg-red-400", name: "Rejected" },
  ];

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } }, };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 }, };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Kanban View</h1>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex justify-center items-center h-96 text-slate-500">Loading candidates...</div>
      ) : (
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="flex gap-6 overflow-x-auto py-6"
        >
          {stages.map(({ stage, color, name }) => (
            <motion.div key={stage} variants={itemVariants}>
              <StageColumn
                stage={stage}
                name={name}
                color={color}
                candidates={candidates.filter((c) => c.stage === stage)}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

