import { CandidateStage, Candidate } from "@/mock/db";
import CandidateCard from "./CandidateCard";
import { Plus } from "lucide-react";

export default function StageColumn({
  stage,
  name,
  color,
  candidates,
  onDrop,
  onDragOver,
  onDragStart,
}: {
  stage: CandidateStage;
  name: string;
  color: string;
  candidates: Candidate[];
  onDrop: (e: React.DragEvent, s: CandidateStage) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, c: Candidate) => void;
}) {
  return (
    <div className="w-80 bg-slate-100 rounded-lg shadow-sm border border-slate-200 flex flex-col flex-shrink-0">
      {/* Column Header */}
      <div className={`p-3 rounded-t-lg ${color}`}>
        <h2 className="font-semibold text-white text-sm">
          {name} / {candidates.length}
        </h2>
      </div>
      {/* Droppable Area & Cards */}
      <div
        className="p-3 flex-grow min-h-[100px]"
        onDrop={(e) => onDrop(e, stage)}
        onDragOver={onDragOver}
      >
        {candidates.map((c) => (
          <CandidateCard key={c.id} candidate={c} onDragStart={onDragStart} />
        ))}
      </div>
      {/* Add Button */}
      <button className="flex w-full items-center gap-2 p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-b-lg transition-colors">
          <Plus size={16}/> Add Candidate
      </button>
    </div>
  );
}

