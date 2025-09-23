import { Users, Search } from "lucide-react";
import { StageColumn } from "@/components/Stage";
import { useCandidates } from "@/hooks/useCandidates";
import { CandidateStage } from "@/mock/db";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function CandidatesKanban() {
  const { candidates, loading, updateStage } = useCandidates();
  const [dragged, setDragged] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [job, setJob] = useState("All Jobs");
  const [stageFilter, setStageFilter] = useState("All");

  const handleDrop = (e: React.DragEvent, stage: CandidateStage) => {
    e.preventDefault();
    if (dragged && dragged.stage !== stage) {
      updateStage(dragged.id, stage);
    }
    setDragged(null);
  };

  const handleDragStart = (e: React.DragEvent, candidate: any) => {
    setDragged(candidate);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchJob = job === "All Jobs" || c.jobTitle === job;
    const matchStage = stageFilter === "All" || c.stage === stageFilter;
    return matchSearch && matchJob && matchStage;
  });

  const stages: { stage: CandidateStage; color: string }[] = [
  { stage: "applied", color: "bg-blue-500" },
  { stage: "screen", color: "bg-orange-500" },
  { stage: "tech", color: "bg-purple-500" },
  { stage: "offer", color: "bg-teal-500" },
  { stage: "hired", color: "bg-green-500" },
  { stage: "rejected", color: "bg-red-500" },
];

const candidateStages: CandidateStage[] = [
  "applied",
  "screen",
  "tech",
  "offer",
  "hired",
  "rejected",
];
  const jobs = [...new Set(candidates.map((c) => c.jobTitle))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading candidates...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Users className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">Candidates</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search candidates..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Stage: All</SelectItem>
            {Object.values(candidateStages).map((s) => (
              <SelectItem key={s} value={s}>
                Stage: {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={job} onValueChange={setJob}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Jobs">Job: All</SelectItem>
            {jobs.map((j) => (
              <SelectItem key={j} value={j}>
                Job: {j}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban */}
      <div className="flex gap-6 overflow-x-auto pb-6">
        {stages.map(({ stage, color }) => (
          <StageColumn
            key={stage}
            stage={stage}
            candidates={filtered.filter((c) => c.stage === stage)}
            count={filtered.filter((c) => c.stage === stage).length}
            color={color}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
}
