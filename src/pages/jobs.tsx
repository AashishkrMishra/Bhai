// src/pages/jobs.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, Reorder } from "framer-motion";
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
  status: "Active" | "Archived";
  location: string;
  type: string;
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
  const [status, setStatus] = useState<"All" | "Active" | "Archived">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [open, setOpen] = useState(false);

  const allTags = [
    "React", "Angular", "Vue.js", "Python", "Node.js", "Docker", "AWS",
    "TypeScript", "JavaScript", "REST API", "GraphQL", "Kubernetes"
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

        const processedData = result.data.map((job: Job, index: number) => ({
          ...job,
          status: index % 2 === 0 ? 'Active' : 'Archived',
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

  const handleReorder = async (newOrder: Job[]) => {
    const prevOrder = [...dragList];
    setDragList(newOrder);
    setJobs(newOrder); // <-- update the main jobs array as well!

    try {
      // Simulate API call to persist order with 10% chance of failure
      await new Promise(resolve => setTimeout(resolve, 500));
      if (Math.random() < 0.1) {
        throw new Error("API Error: Failed to update job order");
      }
      toast.success("Job order updated!");
    } catch (err) {
      setDragList(prevOrder);
      setJobs(prevOrder); // rollback
      toast.error("Failed to update job order. Reverting.");
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

  // Job Card Component for Grid View
  const JobCard = ({ job }: { job: Job }) => (
    <Card className="bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl flex flex-col h-full group relative">
      {/* Drag Handle - only visible on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="bg-slate-100 hover:bg-slate-200 rounded p-1 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-slate-400" />
        </div>
      </div>
      
      <div onClick={() => navigate(`/jobs/${job.id}`)}>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                {job.companyIcon}
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">{job.title}</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              {job.status === 'Active' ? (
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
  );

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
              <Button variant={view === "grid" ? "default" : "outline"} onClick={() => setView("grid")}><Grid size={16} /></Button>
              <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}><List size={16} /></Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={() => setOpen(true)}><Plus size={16} /> Create Job</Button>
            </div>
          </div>
          <Tabs defaultValue="All" onValueChange={(v: any) => setStatus(v)}>
            <TabsList>
              <TabsTrigger value="All">All Jobs</TabsTrigger>
              <TabsTrigger value="Active">Active</TabsTrigger>
              <TabsTrigger value="Archived">Archived</TabsTrigger>
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
        </div>

        {/* --- Drag-and-drop for LIST view --- */}
        {view === "list" ? (
          <Reorder.Group
            axis="y"
            values={dragList}
            onReorder={handleReorder}
            className="space-y-4"
          >
            {loading
              ? Array.from({ length: pageSize }).map((_, index) => <JobCardSkeleton key={index} />)
              : dragList.map((job) => (
                  <Reorder.Item key={job.id} value={job} className="bg-white border border-slate-200 rounded-xl shadow-sm">
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
                        {job.status === 'Active' ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border border-green-200/80 gap-1.5">
                            <CheckCircle2 size={14} /> Active
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100/80 border border-amber-200/80 gap-1.5">
                            <Archive size={14} /> Archived
                          </Badge>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/jobs/${job.id}`)}>
                          <MoreHorizontal size={16} />
                        </Button>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
          </Reorder.Group>
        ) : (
          /* --- Drag-and-drop for GRID view --- */
          <Reorder.Group
            axis="y"
            values={dragList}
            onReorder={handleReorder}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading
              ? Array.from({ length: pageSize }).map((_, index) => <JobCardSkeleton key={index} />)
              : dragList.map((job) => (
                  <Reorder.Item 
                    key={job.id} 
                    value={job}
                    className="h-full"
                    // Add layout animation for smooth transitions
                    layout
                    initial={false}
                    animate={{ scale: 1 }}
                    whileDrag={{ scale: 1.05, rotate: 2, zIndex: 999 }}
                    dragElastic={0.1}
                  >
                    <JobCard job={job} />
                  </Reorder.Item>
                ))}
          </Reorder.Group>
        )}

        {!loading && (
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={16} className="mr-1"/> Previous
            </Button>
            <span className="px-2 text-slate-500 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight size={16} className="ml-1"/>
            </Button>
          </div>
        )}

        {open && <CreateJobModal open={open} onClose={() => setOpen(false)} />}
      </div>
    </Layout>
  );
}