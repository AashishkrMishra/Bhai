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
      <div className="p-6 text-white">
        <div className="mb-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-slate-300 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} /> Back
          </Button>
        </div>
        <h1 className="text-2xl font-bold mb-2">Candidates</h1>
        <p className="text-slate-400 mb-6">
          Manage and track your talent pipeline
        </p>

        {/* ✅ Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Users className="text-blue-400" />
            <div>
              <p className="text-sm text-slate-400">Total Candidates</p>
              <h2 className="text-xl font-bold">{total}</h2>
            </div>
          </Card>
          <Card className="p-4 bg-slate-900 border border-slate-800 flex items-center gap-3">
            <CheckCircle className="text-green-400" />
            <div>
              <p className="text-sm text-slate-400">Hired</p>
              <h2 className="text-xl font-bold">{hired}</h2>
            </div>
          </Card>
          <Card className="p-4 bg-slate-900 border border-slate-800 flex items-center gap-3">
            <XCircle className="text-red-400" />
            <div>
              <p className="text-sm text-slate-400">Rejected</p>
              <h2 className="text-xl font-bold">{rejected}</h2>
            </div>
          </Card>
          <Card className="p-4 bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Hourglass className="text-yellow-400" />
            <div>
              <p className="text-sm text-slate-400">In Progress</p>
              <h2 className="text-xl font-bold">{inProgress}</h2>
            </div>
          </Card>
        </div>

        {/* ✅ Filters */}
        <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6">
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white"
          />

          <Select onValueChange={setStage} defaultValue={stage}>
            <SelectTrigger className="bg-slate-800 border-slate-700 w-40">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setJob} defaultValue={job}>
            <SelectTrigger className="bg-slate-800 border-slate-700 w-40">
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

          {/* Toggle View */}
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
        </div>

        {/* ✅ Conditional Rendering */}
        {view === "list" ? (
          <div className="grid gap-4 grid-cols-1">
            {filtered.map((c) => (
              <Card
                key={c.id}
                onClick={() => navigate(`/candidates/${c.id}`)}
                className="p-4 bg-slate-900 border border-slate-800 cursor-pointer hover:shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{c.name}</h2>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Mail size={16} /> {c.email}
                    </p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Phone size={16} /> {c.phone}
                    </p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Hourglass size={16} /> {c.jobTitle}
                    </p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Calendar size={16} /> Applied{" "}
                      {new Date(c.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full capitalize ${
                      c.stage === "hired"
                        ? "bg-green-600"
                        : c.stage === "rejected"
                        ? "bg-red-600"
                        : "bg-purple-600"
                    }`}
                  >
                    {c.stage}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <h1>hello</h1>
        )}
      </div>
    </Layout>
  );
}