import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CandidateStage } from "@/mock/db";

// Minimal Card and Column for DnD

type KanbanCandidate = {
  id: number;
  name: string;
  jobTitle: string;
  stage: CandidateStage;
  order?: number;
  [key: string]: any;
};

function KanbanCard({ candidate }: { candidate: KanbanCandidate }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3 border cursor-grab transition">
      <div className="font-semibold text-slate-800">{candidate.name}</div>
      <div className="text-xs text-slate-500">{candidate.jobTitle}</div>
    </div>
  );
}

function SortableKanbanCard({ candidate }: { candidate: KanbanCandidate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id });
  const style = {
    ...(transform ? { transform: CSS.Transform.toString(transform) } : {}),
    ...(transition ? { transition } : {}),
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow p-4 mb-3 border cursor-grab transition ${isDragging ? "opacity-60" : ""}`}
    >
      <div className="font-semibold text-slate-800">{candidate.name}</div>
      <div className="text-xs text-slate-500">{candidate.jobTitle}</div>
    </div>
  );
}

function KanbanColumn({
  stage,
  name,
  color,
  candidates,
  children,
}: {
  stage: CandidateStage;
  name: string;
  color: string;
  candidates: KanbanCandidate[];
  children?: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-64">
      <div className={`rounded-t-lg px-4 py-2 font-bold text-white ${color}`}>{name} <span className="ml-2 text-xs">/ {candidates.length}</span></div>
      <div className="bg-slate-100 rounded-b-lg p-3 min-h-40">
        {children}
      </div>
    </div>
  );
}

// API helpers for backend
async function fetchCandidates(): Promise<KanbanCandidate[]> {
  const res = await fetch('/candidates');
  if (!res.ok) throw new Error('Failed to fetch candidates');
  const data = await res.json();
  return data.data;
}

async function patchCandidateStage(id: number, stage: CandidateStage) {
  await fetch(`/candidates/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage })
  });
}

export default function KannuBannu({ candidates: initialCandidates }: { candidates: any[] }) {
  const [candidates, setCandidates] = useState<KanbanCandidate[]>(initialCandidates);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  // Always fetch from backend on mount
  async function loadCandidates() {
    setLoading(true);
    try {
      const data = await fetchCandidates();
      setCandidates(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCandidates();
    // eslint-disable-next-line
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const stages: { stage: CandidateStage; color: string; name: string }[] = [
    { stage: "applied", color: "bg-slate-400", name: "Applied" },
    { stage: "screen", color: "bg-orange-400", name: "Screen" },
    { stage: "tech", color: "bg-purple-400", name: "Tech Interview" },
    { stage: "offer", color: "bg-sky-400", name: "Offer" },
    { stage: "hired", color: "bg-green-400", name: "Hired" },
    { stage: "rejected", color: "bg-red-400", name: "Rejected" },
  ];

  // Group candidates by stage, and sort by order if available
  const stageMap: Record<string, KanbanCandidate[]> = {};
  stages.forEach(({ stage }) => {
    stageMap[stage] = candidates
      .filter((c) => c.stage === stage)
      .sort((a, b) => ((a.order ?? 0) - (b.order ?? 0)));
  });

  // DnD Handlers
  function handleDragStart(event: any) {
    setActiveId(Number(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !active) {
      setActiveId(null);
      return;
    }
    const fromId = Number(active.id);
    const toId = over.id;
    // Find the candidate being dragged
    const candidate = candidates.find((c) => c.id === fromId);
    if (!candidate) {
      setActiveId(null);
      return;
    }
    // Find the stage (column) where the card was dropped
    let toStage: CandidateStage | null = null;
    for (const { stage } of stages) {
      if (stageMap[stage].some((c) => String(c.id) === String(toId))) {
        toStage = stage;
        break;
      }
    }
    // If dropped on empty column, fallback to column id
    if (!toStage && stages.some(s => s.stage === toId)) {
      toStage = toId as CandidateStage;
    }
    if (!toStage) {
      setActiveId(null);
      return;
    }
    // Only update if stage actually changed
    if (candidate.stage !== toStage) {
      await patchCandidateStage(candidate.id, toStage);
      await loadCandidates();
    }
    setActiveId(null);
  }

  return (
    <div className="min-h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Kanban View</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-96 text-slate-500">Loading candidates...</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto py-6">
            {stages.map(({ stage, color, name }) => (
              <KanbanColumn key={stage} stage={stage} name={name} color={color} candidates={stageMap[stage]}>
                <SortableContext items={stageMap[stage].map((c) => c.id!)} strategy={verticalListSortingStrategy}>
                  {stageMap[stage].map((candidate) => (
                    <SortableKanbanCard key={candidate.id} candidate={candidate} />
                  ))}
                </SortableContext>
              </KanbanColumn>
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}

