import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, FileCheck, Layers, Search } from "lucide-react";
import Layout from "@/components/layout";
import NewAssignmentModal from "@/components/AssignmentModal";
import { useState, useEffect, useMemo } from "react";
import Preview from "@/components/LivePreview";
import AssessmentBuilder from "./assesmentBuilder";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Assessment = {
  id: number;
  jobId: number;
  title: string;
  description: string;
  role: string;
  duration: string;
  submissions: number;
  status: "Active" | "Draft";
  sections: any[];
  totalQuestions: number;
  jobTitle?: string;
};

export default function Assignments() {
  const [open, setOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [editing, setEditing] = useState<Assessment | null>(null);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("All Jobs");
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/assessments");
        const json = await res.json();
        setAssignments(json.data);
      } catch (e) {
        console.error("Failed to fetch assessments", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (selected) {
    return (
      <Layout>
        <Preview assessment={selected} onBack={() => setSelected(null)} />
      </Layout>
    );
  }

  if (editing) {
    return <AssessmentBuilder initialAssessment={editing} />;
  }

  // Stats
  const total = assignments.length;
  const active = assignments.filter((a) => a.status === "Active").length;
  const submissions = assignments.reduce(
    (sum, a) => sum + (a.submissions ?? 0),
    0
  );
  const totalQuestions = assignments.reduce(
    (sum, a) => sum + (a.totalQuestions ?? 0),
    0
  );
  const durations = assignments.map((a) => {
    if (!a.duration) return 0;
    const match = a.duration.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  });
  const avgDuration =
    durations.length > 0
      ? Math.round(durations.reduce((s, d) => s + d, 0) / durations.length)
      : 0;

  // Unique job titles for dropdown
  const jobTitles = [
    ...new Set(assignments.map((a) => a.jobTitle || a.role)),
  ];

  // Filtered assessments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.jobTitle || a.role).toLowerCase().includes(search.toLowerCase());
      const matchesJob =
        jobFilter === "All Jobs" ||
        (a.jobTitle || a.role) === jobFilter;
      const matchesStatus =
        statusFilter === "All" || a.status === statusFilter;
      return matchesSearch && matchesJob && matchesStatus;
    });
  }, [assignments, search, jobFilter, statusFilter]);

  return (
    <Layout>
      <main className="flex-1 px-6 pb-6 pt-0 overflow-y-auto bg-slate-50">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-700">Assessments</h1>
            <Button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              onClick={() => setOpen(true)}
            >
              + New Assessment
            </Button>
            {open && <NewAssignmentModal onClose={() => setOpen(false)} />}
          </div>

          {/* Filter Bar */}
          <Card className="p-4 flex flex-col md:flex-row gap-3 items-center bg-white border border-slate-200 shadow-sm">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by job or assignment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-50"
              />
            </div>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full md:w-40 bg-slate-50">
                <SelectValue placeholder="All Jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Jobs">All Jobs</SelectItem>
                {jobTitles.map((job) => (
                  <SelectItem key={job} value={job}>
                    {job}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-slate-50">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Total Assessments</h2>
              <p className="text-2xl font-bold text-slate-800">{total}</p>
            </Card>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Active Assessments</h2>
              <p className="text-2xl font-bold text-green-600">{active}</p>
            </Card>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Avg Duration</h2>
              <p className="text-2xl font-bold text-yellow-500">
                {avgDuration} min
              </p>
            </Card>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Total Submissions</h2>
              <p className="text-2xl font-bold text-blue-600">{submissions}</p>
            </Card>
          </div>

          {/* List */}
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Your Assessments</h2>
          {loading ? (
            <p className="text-slate-400">Loading assessments...</p>
          ) : filteredAssignments.length === 0 ? (
            <p className="text-slate-400">No assessments found.</p>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((a) => (
                <Card
                  key={a.id}
                  className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-lg transition rounded-xl flex justify-between items-center"
                >
                  {/* Left */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{a.title}</h3>
                    <p className="text-slate-500">{a.role}</p>
                    {a.description && (
                      <p className="text-slate-400 text-sm mt-1">
                        {a.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileCheck size={14} /> {a.totalQuestions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers size={14} /> {a.sections?.length || 0} sections
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {a.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {a.submissions} submissions
                      </span>
                    </div>
                  </div>
                  {/* Right */}
                  <div className="flex gap-3 items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        a.status === "Active"
                          ? "bg-green-100 text-green-600 border border-green-200"
                          : "bg-yellow-100 text-yellow-600 border border-yellow-200"
                      }`}
                    >
                      {a.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelected(a)}
                      className="border-slate-300 text-slate-700 font-semibold"
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(a)}
                      className="border-slate-300 text-slate-700 font-semibold"
                    >
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}