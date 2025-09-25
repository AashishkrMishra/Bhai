import { Card } from "@/components/ui/card";
import { Candidate } from "../mock/type";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CandidateCard({
  candidate,
  onDragStart,
}: {
  candidate: Candidate;
  onDragStart: (e: React.DragEvent, c: Candidate) => void;
}) {
  if (!candidate) {
    return null; // or a loading/placeholder state
  }
  
  const initials = candidate.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <Card
      className="p-3 mb-3 bg-white cursor-grab active:cursor-grabbing shadow-sm hover:shadow-lg transition-shadow border-l-4 border-transparent hover:border-indigo-400"
      draggable
      onDragStart={(e) => onDragStart(e, candidate)}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm text-slate-800">{candidate.name}</p>
        <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal size={16} className="text-slate-500"/>
        </Button>
      </div>
      <p className="text-xs text-slate-500 mt-1">{candidate.jobTitle}</p>
      <div className="flex items-center justify-end mt-2">
         <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs flex-shrink-0">
          {initials}
        </div>
      </div>
    </Card>
  );
}

