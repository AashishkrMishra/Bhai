// src/pages/jobs.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  date?: string; // Changed to optional to handle missing data
  skills?: string[];
  companyIcon?: React.ReactNode;
};

// --- Skeleton Component for Loading State ---
const JobCardSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-slate-200"></div>
        <div>
          <div className="h-5 w-40 bg-slate-200 rounded"></div>
          <div className="h-4 w-48 bg-slate-200 rounded mt-2"></div>
        </div>
      </div>
      <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
    </div>
    <div className="mt-4 space-y-3">
      <div className="h-4 w-full bg-slate-200 rounded"></div>
      <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
    </div>
    <div className="flex items-center gap-4 mt-4">
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
      <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
    </div>
  </div>
);

// --- Main Jobs Page Component ---
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
  
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const res = await fetch(
          `/jobs?page=${page}&pageSize=${pageSize}&status=${
            status !== "All" ? status : ""
          }&search=${search}`
        );
        const result = await res.json();
        
        const jobsWithIcons = result.data.map((job: Job) => ({
            ...job,
            companyIcon: <Briefcase className="h-6 w-6 text-indigo-500" />
        }))

        setJobs(jobsWithIcons || []);
        setTotal(result.total || 0);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [page, pageSize, status, search]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredJobs = jobs.filter(
    (job) =>
      selectedTags.length === 0 ||
      selectedTags.every((tag) => job.skills?.includes(tag))
  );

  const totalPages = Math.ceil(total / pageSize);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={
            view === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {loading
            ? Array.from({ length: pageSize }).map((_, index) => <JobCardSkeleton key={index} />)
            : filteredJobs.map((job) => (
                <motion.div key={job.id} variants={itemVariants}>
                  <Card
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl overflow-hidden"
                  >
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                {job.companyIcon}
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900">{job.title}</CardTitle>
                                <p className="text-sm text-slate-500">{job.description}</p>
                            </div>
                        </div>
                        <Badge variant={job.status === "Active" ? "default" : "secondary"}>{job.status}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="flex items-center text-sm text-slate-500 gap-6">
                          <div className="flex items-center gap-2">
                              <MapPin size={16} />
                              <span>{job.location || 'Remote'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              {/* ## FIX: Added a check for job.date to prevent crash ## */}
                              <span>{job.date ? format(parseISO(job.date), 'MMM d, yyyy') : 'N/A'}</span>
                          </div>
                      </div>
                      <div className="flex items-center flex-wrap gap-2 border-t border-slate-200 pt-4">
                        <Badge variant="outline" className="capitalize">{job.type}</Badge>
                        {(job.skills || []).slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="secondary">{skill}</Badge>
                        ))}
                        {(job.skills?.length || 0) > 3 && (
                            <Badge variant="secondary">+{ (job.skills?.length || 0) - 3} more</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </motion.div>

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