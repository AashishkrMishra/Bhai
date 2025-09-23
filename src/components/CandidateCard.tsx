import { Mail, Phone, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Candidate } from "@/mock/db";

export function CandidateCard({
  candidate,
  onDragStart,
}: {
  candidate: Candidate;
  onDragStart: (e: React.DragEvent, c: Candidate) => void;
}) {
  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      className="bg-slate-800 border border-slate-700 p-4 mb-3 cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, candidate)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm mb-2 truncate">
            {candidate.name}
          </h3>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-3 h-3" /> {candidate.email}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3 h-3" /> {candidate.phone}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-3 h-3" /> Applied {candidate.appliedDate}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
