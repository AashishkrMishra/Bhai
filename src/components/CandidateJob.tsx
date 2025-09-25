import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Candidate } from "@/mock/type";
import Layout from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Mail,
  Phone,
  Calendar,
  List,
  Grid,
  Users,
  CheckCircle,
  XCircle,
  Hourglass,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CandidatesJob() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filtered, setFiltered] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All");
  const [job, setJob] = useState("All Jobs");
  const [view, setView] = useState<"list" | "kanban">("list");

  // ✅ Fetch from API
  useEffect(() => {
    (async () => {
      const res = await fetch(`/jobs/${jobId}/candidates`);
      const data = await res.json();
      setCandidates(data.candidates);
      setFiltered(data.candidates);
    })();
  }, [jobId]);

  // ✅ Filtering
  useEffect(() => {
    let list = [...candidates];

    if (search) {
      list = list.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (stage !== "All") {
      list = list.filter((c) => c.stage.toLowerCase() === stage.toLowerCase());
    }
    if (job !== "All Jobs") {
      list = list.filter((c) => c.jobTitle === job);
    }

    setFiltered(list);
  }, [search, stage, job, candidates]);

  // ✅ Stats
  const total = candidates.length;
  const hired = candidates.filter((c) => c.stage === "hired").length;
  const rejected = candidates.filter((c) => c.stage === "rejected").length;
  const inProgress = total - hired - rejected;

  return (
    <Layout>
      <main className="flex-1 px-6 pb-6 pt-0 overflow-y-auto bg-slate-50">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-700"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={18} /> Back
              </Button>
              <h1 className="text-3xl font-bold text-indigo-700">Candidates</h1>
            </div>
          </div>

          {/* Filter Bar */}
          <Card className="p-4 flex flex-col md:flex-row gap-3 items-center bg-white border border-slate-200 shadow-sm">
            <div className="relative w-full md:w-1/3">
              <List className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-50"
              />
            </div>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-full md:w-40 bg-slate-50">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Stages</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={job} onValueChange={setJob}>
              <SelectTrigger className="w-full md:w-40 bg-slate-50">
                <SelectValue placeholder="Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Jobs">All Jobs</SelectItem>
                {[...new Set(candidates.map((c) => c.jobTitle))].map(
                  (jobTitle) => (
                    <SelectItem key={jobTitle} value={jobTitle}>
                      {jobTitle}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="icon"
                variant={view === "list" ? "default" : "outline"}
                onClick={() => setView("list")}
                className="rounded-lg"
              >
                <List size={18} />
              </Button>
              <Button
                size="icon"
                variant={view === "kanban" ? "default" : "outline"}
                onClick={() => setView("kanban")}
                className="rounded-lg"
              >
                <Grid size={18} />
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Total Candidates</h2>
              <p className="text-2xl font-bold text-slate-800">{total}</p>
            </Card>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Hired</h2>
              <p className="text-2xl font-bold text-green-600">{hired}</p>
            </Card>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Rejected</h2>
              <p className="text-2xl font-bold text-red-600">{rejected}</p>
            </Card>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">In Progress</h2>
              <p className="text-2xl font-bold text-yellow-500">{inProgress}</p>
            </Card>
          </div>

          {/* List */}
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Your Candidates</h2>
          {filtered.length === 0 ? (
            <p className="text-slate-400">No candidates found.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((c) => (
                <Card
                  key={c.id}
                  onClick={() => navigate(`/candidates/${c.id}`)}
                  className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-lg transition rounded-xl flex justify-between items-center cursor-pointer"
                >
                  {/* Left */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{c.name}</h3>
                    <p className="text-slate-500">{c.jobTitle}</p>
                    <p className="text-slate-400 text-sm mt-1">{c.email} | {c.phone}</p>
                    <div className="flex gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Applied {new Date(c.appliedDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Hourglass size={14} /> {c.stage}
                      </span>
                    </div>
                  </div>
                  {/* Right */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      c.stage === "hired"
                        ? "bg-green-100 text-green-600 border border-green-200"
                        : c.stage === "rejected"
                        ? "bg-red-100 text-red-600 border border-red-200"
                        : "bg-purple-100 text-purple-600 border border-purple-200"
                    }`}
                  >
                    {c.stage}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}