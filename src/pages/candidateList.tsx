// src/pages/candidateList.tsx

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {  Candidate, CandidateStage } from "@/mock/type";
import { db } from "@/mock/db";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  Calendar,
  List,
  LayoutGrid,
  Users,
  CheckCircle2,
  XCircle,
  Hourglass,
  Search,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import Layout from "@/components/layout";
import KannuBannu from "@/components/kannubannu"; // Updated Import
import { format } from "date-fns";

const getStageBadgeStyle = (stage: CandidateStage) => {
  switch (stage) {
    case "hired": return "bg-green-100 text-green-800 border-green-200/80";
    case "rejected": return "bg-red-100 text-red-800 border-red-200/80";
    case "offer": return "bg-blue-100 text-blue-800 border-blue-200/80";
    case "tech": return "bg-purple-100 text-purple-800 border-purple-200/80";
    case "screen": return "bg-orange-100 text-orange-800 border-orange-200/80";
    case "applied":
    default: return "bg-slate-100 text-slate-800 border-slate-200/80";
  }
};

export default function CandidatesList() {
  const navigate = useNavigate();
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All");
  const [job, setJob] = useState("All Jobs");
  const [view, setView] = useState<"list" | "kanban">("list");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const candidatesFromDb = await db.candidates.toArray();
      setAllCandidates(candidatesFromDb);
      setLoading(false);
    })();
  }, []);

  const filteredCandidates = useMemo(() => {
    return allCandidates.filter((c) => {
      const searchLower = search.toLowerCase();
      const nameMatch = c.name.toLowerCase().includes(searchLower);
      const emailMatch = c.email.toLowerCase().includes(searchLower);
      const stageMatch = stage === "All" || c.stage.toLowerCase() === stage.toLowerCase();
      const jobMatch = job === "All Jobs" || c.jobTitle === job;
      return (nameMatch || emailMatch) && stageMatch && jobMatch;
    });
  }, [allCandidates, search, stage, job]);

  const paginatedCandidates = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCandidates.slice(start, start + pageSize);
  }, [filteredCandidates, page, pageSize]);

  const totalPages = Math.ceil(filteredCandidates.length / pageSize);
  const total = allCandidates.length;
  const hired = allCandidates.filter((c) => c.stage === "hired").length;
  const rejected = allCandidates.filter((c) => c.stage === "rejected").length;
  const inProgress = total - hired - rejected;

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } }, };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 }, };
  
  const startItem = filteredCandidates.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, filteredCandidates.length);

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-slate-50">
        <div><h1 className="text-3xl font-bold text-slate-800">Candidates</h1><p className="text-slate-500 mt-1">Manage and track your entire talent pipeline.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-slate-200 flex items-center gap-4"><Users className="text-blue-500 h-8 w-8" /><div><p className="text-sm text-slate-500">Total Candidates</p><h2 className="text-2xl font-bold text-slate-800">{total}</h2></div></Card>
          <Card className="p-4 bg-white border-slate-200 flex items-center gap-4"><CheckCircle2 className="text-green-500 h-8 w-8" /><div><p className="text-sm text-slate-500">Hired</p><h2 className="text-2xl font-bold text-slate-800">{hired}</h2></div></Card>
          <Card className="p-4 bg-white border-slate-200 flex items-center gap-4"><XCircle className="text-red-500 h-8 w-8" /><div><p className="text-sm text-slate-500">Rejected</p><h2 className="text-2xl font-bold text-slate-800">{rejected}</h2></div></Card>
          <Card className="p-4 bg-white border-slate-200 flex items-center gap-4"><Hourglass className="text-yellow-500 h-8 w-8" /><div><p className="text-sm text-slate-500">In Progress</p><h2 className="text-2xl font-bold text-slate-800">{inProgress}</h2></div></Card>
        </div>
        <Card className="p-4 bg-white border-slate-200">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative w-full md:w-auto md:flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input placeholder="Search by name or email..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} className="pl-10 bg-slate-50" /></div>
            <Select onValueChange={(val) => { setPage(1); setStage(val); }} defaultValue={stage}><SelectTrigger className="w-full md:w-40 bg-slate-50"><SelectValue placeholder="Stage" /></SelectTrigger><SelectContent><SelectItem value="All">All Stages</SelectItem><SelectItem value="applied">Applied</SelectItem><SelectItem value="screen">Screen</SelectItem><SelectItem value="tech">Tech</SelectItem><SelectItem value="offer">Offer</SelectItem><SelectItem value="hired">Hired</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select>
            <Select onValueChange={(val) => { setPage(1); setJob(val); }} defaultValue={job}><SelectTrigger className="w-full md:w-48 bg-slate-50"><SelectValue placeholder="Job" /></SelectTrigger><SelectContent><SelectItem value="All Jobs">All Jobs</SelectItem>{[...new Set(allCandidates.map((c) => c.jobTitle))].map((jobTitle) => (<SelectItem key={jobTitle} value={jobTitle}>{jobTitle}</SelectItem>))}</SelectContent></Select>
            <div className="ml-auto flex items-center gap-2"><Button size="icon" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}><List size={18} /></Button><Button size="icon" variant={view === "kanban" ? "default" : "outline"} onClick={() => setView("kanban")}><LayoutGrid size={18} /></Button></div>
          </div>
        </Card>

        {view === "list" ? (
          <>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
              <motion.div variants={containerVariants} initial="hidden" animate="show">
                {paginatedCandidates.map((c) => (
                  <motion.div key={c.id} variants={itemVariants} onClick={() => navigate(`/candidates/${c.id}`)} className="grid grid-cols-6 items-center p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 cursor-pointer">
                    <div className="col-span-2 flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 flex-shrink-0">{c.name.charAt(0).toUpperCase()}</div><div><p className="font-semibold text-slate-800">{c.name}</p><p className="text-sm text-slate-500 flex items-center gap-1.5"><Mail size={14} />{c.email}</p></div></div>
                    <div className="text-sm text-slate-600 flex items-center gap-2"><Briefcase size={14} /> {c.jobTitle}</div>
                    <div><Badge className={`capitalize ${getStageBadgeStyle(c.stage)}`}>{c.stage}</Badge></div>
                    <div className="text-sm text-slate-600 flex items-center gap-2"><Phone size={14} /> {c.phone}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-2 justify-end"><Calendar size={14} /> {format(new Date(c.appliedDate), "MMM d, yyyy")}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{filteredCandidates.length}</strong> candidates</span>
              <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft size={16} className="mr-1" /> Previous</Button><Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages || totalPages === 0}><ChevronRight size={16} className="ml-1" /> Next</Button></div>
            </div>
          </>
        ) : (
          <KannuBannu candidates={filteredCandidates} />
        )}
      </div>
    </Layout>
  );
}

