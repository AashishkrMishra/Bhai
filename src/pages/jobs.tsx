// src/pages/jobs.tsx
import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Sortable Job Card for Grid View
function SortableJobCard({ job, id }: { job: Job; id: number | string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
  };
  const navigate = useNavigate();
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="h-full min-h-[340px]">
      <Card className="bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl flex flex-col h-full group relative">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-slate-100 hover:bg-slate-200 rounded p-1 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        <div onClick={() => job.id && job.id !== undefined && typeof job.id === 'number' ? navigate(`/jobs/${job.id}`) : undefined}>
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  {job.companyIcon}
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">{job.title}</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                {job.status === 'active' ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border border-green-200/80 gap-1.5">
                    <CheckCircle2 size={14} /> Active
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100/80 border border-amber-200/80 gap-1.5">
                    <Archive size={14} /> Archived
                  </Badge>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {e.stopPropagation();}}>
                  <MoreHorizontal size={16} />
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-500 pt-1">{job.description}</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 flex flex-col flex-grow">
            <div className="flex items-center flex-wrap text-sm text-slate-500 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} /> <span>{job.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={16} /> <span className="capitalize">{job.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{job.date ? format(parseISO(job.date), 'MMM d, yyyy') : 'N/A'}</span>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-100 flex flex-col flex-grow">
              {(job.requirements && job.requirements.length > 0) && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                  <h4 className="font-semibold text-xs text-slate-600 mb-2 flex items-center gap-2"><Star size={14}/> Key Requirements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {job.requirements.slice(0, 2).map((req, i) => (
                      <li key={i} className="text-xs text-slate-500">{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(job.skills && job.skills.length > 0) && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 mt-auto">
                  <h4 className="font-semibold text-xs text-slate-600 mb-2 flex items-center gap-1"><Dot/> Skills & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 4).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="flex items-center gap-1.5 font-normal">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 4 && (
                      <Badge variant="secondary" className="font-normal">+{job.skills.length - 4} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

// Sortable Job Card for List View
function SortableListJobCard({ job, id }: { job: Job; id: number | string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <GripVertical className="text-slate-400 cursor-grab active:cursor-grabbing" />
        <div className="h-12 w-10 rounded-full bg-slate-100 flex items-center justify-center">
          {job.companyIcon}
        </div>
        <div className="flex-grow">
          <CardTitle className="text-lg font-bold text-slate-900">{job.title}</CardTitle>
          <p className="text-sm text-slate-500">{job.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {job.status === 'active' ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border border-green-200/80 gap-1.5">
              <CheckCircle2 size={14} /> Active
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100/80 border border-amber-200/80 gap-1.5">
              <Archive size={14} /> Archived
            </Badge>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => job.id && job.id !== undefined && typeof job.id === 'number' ? window.location.href = `/jobs/${job.id}` : undefined}>
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Search,
  MapPin,
  Calendar,
  Briefcase,
  Plus,
  Star,
  Archive,
  CheckCircle2,
  Dot,
  MoreHorizontal,
  GripVertical,
} from "lucide-react";
import Layout from "@/components/layout";
import CreateJobModal from "@/components/JobModal";
import { format, parseISO } from "date-fns";

type Job = {
  id: number;
  title: string;
  description: string;
  status: "active" | "archived";
  location: string;
  type: string;
  order: number;
  date?: string;
  skills?: string[];
  requirements?: string[];
  companyIcon?: React.ReactNode;
};

const JobCardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="h-12 w-10 rounded-xl bg-slate-200"></div>
        <div>
          <div className="h-5 w-40 bg-slate-200 rounded"></div>
          <div className="h-4 w-48 bg-slate-200 rounded mt-2"></div>
        </div>
      </div>
      <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
    </div>
    <div className="flex items-center gap-4">
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
    </div>
    <div className="space-y-3 pt-2">
      <div className="h-16 bg-slate-100 rounded-lg"></div>
      <div className="h-16 bg-slate-100 rounded-lg"></div>
    </div>
  </div>
);

export default function JobsPage() {

  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [status, setStatus] = useState<"All" | "active" | "archived">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [open, setOpen] = useState(false);

  const allTags = [
    "React", "Angular", "Vue.js", "Python", "Node.js", "Docker", "AWS",
    "TypeScript", "JavaScript", "REST API", "GraphQL", "Kubernetes"
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Helper for pagination display (must be after state declarations)
  const startJob = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endJob = Math.min(page * pageSize, total);
  const pageSizes = [10, 20, 50];

  // --- Fetch jobs ---
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const res = await fetch(
          `/jobs?page=${page}&pageSize=${pageSize}&search=${search}`
        );
        const result = await res.json();

          const processedData = result.data.map((job: Job) => ({
            ...job,
            skills: job.skills && job.skills.length > 0 ? job.skills : ['Node.js', 'React', 'TypeScript', 'AWS', 'Docker'],
            companyIcon: <Briefcase className="h-5 w-5 text-indigo-500" />
          }));

        setJobs(processedData || []);
        setTotal(result.total || 0);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [page, pageSize, search]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter directly on jobs, not filteredJobs
  const filteredJobs = jobs.filter(job => {
    const statusMatch = status === 'All' || job.status === status;
    const tagMatch = selectedTags.length === 0 || selectedTags.every(tag => job.skills?.includes(tag));
    return statusMatch && tagMatch;
  });

  // Use dragList as the source of truth for order
  const [dragList, setDragList] = useState<Job[]>([]);
  // Only set dragList when jobs or filters change, not on every render
  useEffect(() => {
    setDragList(filteredJobs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, status, selectedTags, search, page, pageSize]);

  const handleReorder = async (newOrder: Job[], fromIdx?: number, toIdx?: number) => {
    const prevOrder = [...dragList];
    setDragList(newOrder);
    setJobs(newOrder);

    if (typeof fromIdx === 'number' && typeof toIdx === 'number' && fromIdx !== toIdx) {
      const fromJob = prevOrder[fromIdx];
      const toJob = prevOrder[toIdx];
      try {
        // Call backend reorder API
        const res = await fetch(`/jobs/${fromJob.id}/reorder`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fromOrder: fromJob.order, toOrder: toJob.order })
        });
        if (!res.ok) throw new Error('Failed to reorder jobs');
        // Update the moved job's order in backend
        await fetch(`/jobs/${fromJob.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: toJob.order })
        });
        // Refetch jobs to ensure UI matches backend
        setLoading(true);
        const jobsRes = await fetch(
          `/jobs?page=${page}&pageSize=${pageSize}&search=${search}`
        );
        const result = await jobsRes.json();
        const processedData = result.data.map((job: Job) => ({
          ...job,
          skills: job.skills && job.skills.length > 0 ? job.skills : ['Node.js', 'React', 'TypeScript', 'AWS', 'Docker'],
          companyIcon: <Briefcase className="h-5 w-5 text-indigo-500" />
        }));
        setJobs(processedData || []);
        setTotal(result.total || 0);
        setDragList(processedData || []);
        toast.success('Job order updated!');
      } catch (err) {
        setDragList(prevOrder);
        setJobs(prevOrder);
        toast.error('Failed to update job order. Reverting.');
      } finally {
        setLoading(false);
      }
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-slate-50">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                className="bg-slate-50 border-slate-200 pl-10 text-slate-800 placeholder:text-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search jobs by title, skills, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")}> <Grid size={16} /> </Button>
              <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}> <List size={16} /> </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={() => setOpen(true)}><Plus size={16} /> Create Job</Button>
            </div>
          </div>
          <Tabs defaultValue="All" onValueChange={(v: any) => setStatus(v)}>
            <TabsList>
              <TabsTrigger value="All">All Jobs</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  selectedTags.includes(tag)
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {/* Pagination Bar - light mode, below search/tags/view */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="text-slate-700 text-sm">
              Showing <span className="font-semibold">{startJob}</span> to <span className="font-semibold">{endJob}</span> of <span className="font-semibold">{total}</span> jobs
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-700 text-sm">Show:</span>
              <select
                className="bg-slate-50 text-slate-700 rounded px-3 py-1 border border-slate-200 focus:outline-none"
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                {pageSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {/* Pagination Buttons */}
              <div className="flex items-center gap-1">
                <button
                  className={`px-3 py-1 rounded bg-slate-50 text-slate-700 border border-slate-200 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100'}`}
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  &lt; Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className={`px-3 py-1 rounded bg-slate-50 text-slate-700 border border-slate-200 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100'}`}
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Drag-and-drop for LIST view (using dnd-kit) --- */}
        {view === "list" ? (
          <DndContext
            sensors={useSensors(useSensor(PointerSensor))}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (active.id !== over?.id) {
                const oldIndex = dragList.findIndex((j) => j.id === active.id);
                const newIndex = dragList.findIndex((j) => j.id === over?.id);
                const newOrder = arrayMove(dragList, oldIndex, newIndex);
                handleReorder(newOrder, oldIndex, newIndex);
              }
            }}
          >
            <SortableContext items={dragList.map((j) => j.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {loading
                  ? Array.from({ length: pageSize }).map((_, index) => <JobCardSkeleton key={index} />)
                  : dragList.map((job) => (
                      <SortableListJobCard key={job.id} job={job} id={job.id} />
                    ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          /* --- Drag-and-drop for GRID view (using dnd-kit) --- */
          <DndContext
            sensors={useSensors(useSensor(PointerSensor))}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (active.id !== over?.id) {
                const oldIndex = dragList.findIndex((j) => j.id === active.id);
                const newIndex = dragList.findIndex((j) => j.id === over?.id);
                const newOrder = arrayMove(dragList, oldIndex, newIndex);
                handleReorder(newOrder, oldIndex, newIndex);
              }
            }}
          >
            <SortableContext items={dragList.map((j) => j.id)} strategy={rectSortingStrategy}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                  ? Array.from({ length: pageSize }).map((_, index) => <JobCardSkeleton key={index} />)
                  : dragList.map((job) => (
                      <SortableJobCard key={job.id} job={job} id={job.id} />
                    ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {open && <CreateJobModal open={open} onClose={() => setOpen(false)} />}
      </div>
    </Layout>
  );
}