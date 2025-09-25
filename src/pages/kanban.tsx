// src/components/Kanban.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import CandidateCard from "@/components/CandidateCard";
import { useCandidates } from "@/hooks/useCandidates";
import { Candidate, CandidateStage } from "@/mock/db";
import { Plus } from "lucide-react";

// This component receives the filtered candidates as a prop
export default function Kanban({ candidates }: { candidates: Candidate[] }) {
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
    { stage: "applied", color: "bg-orange-400", name: "Working on it" },
    { stage: "screen", color: "bg-purple-400", name: "Needs review" },
    { stage: "tech", color: "bg-pink-400", name: "In progress" },
    { stage: "offer", color: "bg-sky-400", name: "Interview" },
    { stage: "hired", color: "bg-green-400", name: "Done" },
    { stage: "rejected", color: "bg-red-400", name: "Stuck" },
  ];

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } }, };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 }, };

  if (loading) {
    return <div className="flex justify-center items-center h-96 text-slate-500">Updating...</div>;
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex gap-6 overflow-x-auto py-4"
    >
      {stages.map(({ stage, color, name }) => {
        const candidatesInStage = candidates.filter((c) => c.stage === stage);
        return (
          <motion.div key={stage} variants={itemVariants}>
            <div className="w-72 bg-slate-100 rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
              {/* Column Header */}
              <div className={`p-3 rounded-t-lg ${color}`}>
                <h2 className="font-semibold text-white text-sm">
                  {name} / {candidatesInStage.length}
                </h2>
              </div>
              {/* Droppable Area */}
              <div
                className="p-3 h-full"
                onDrop={(e) => handleDrop(e, stage)}
                onDragOver={handleDragOver}
              >
                {candidatesInStage.map((c) => (
                  <CandidateCard key={c.id} candidate={c} onDragStart={handleDragStart} />
                ))}
                 <button className="flex w-full items-center gap-2 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors">
                    <Plus size={16}/> Add
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}