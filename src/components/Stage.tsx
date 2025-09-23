import { CandidateStage, Candidate } from "@/mock/db";
import { CandidateCard } from "./CandidateCard";

export function StageColumn({
  stage,
  candidates,
  color,
  count,
  onDrop,
  onDragOver,
  onDragStart,
}: {
  stage: CandidateStage;
  candidates: Candidate[];
  color: string;
  count: number;
  onDrop: (e: React.DragEvent, s: CandidateStage) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, c: Candidate) => void;
}) {
  return (
    <div className="flex-1 min-w-80">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <h2 className="text-white font-semibold">{stage}</h2>
        <span className="text-sm bg-slate-700 text-slate-300 px-2 rounded">
          {count}
        </span>
      </div>

      <div
        className="min-h-96 bg-slate-900/50 rounded-lg p-4 border-2 border-dashed border-slate-700"
        onDrop={(e) => onDrop(e, stage)}
        onDragOver={onDragOver}
      >
        {candidates.map((c) => (
          <CandidateCard key={c.id} candidate={c} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}
