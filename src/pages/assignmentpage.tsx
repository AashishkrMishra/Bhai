import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClipboardList, Clock, Users, FileCheck } from "lucide-react";
import Layout from "@/components/layout";
import NewAssignmentModal from "@/components/AssignmentModal";
import { useState } from "react";

type Assignment = {
  id: number;
  title: string;
  role: string;
  duration: string;
  questions: number;
  submissions: number;
  status: "Active" | "Draft";
};

const assignments: Assignment[] = [
  {
    id: 1,
    title: "Frontend Assignment",
    role: "React Developer",
    duration: "~45 min",
    questions: 10,
    submissions: 12,
    status: "Active",
  },
  {
    id: 2,
    title: "Backend Challenge",
    role: "Node.js Developer",
    duration: "~60 min",
    questions: 12,
    submissions: 8,
    status: "Active",
  },
  {
    id: 3,
    title: "System Design Task",
    role: "Software Architect",
    duration: "~90 min",
    questions: 3,
    submissions: 2,
    status: "Draft",
  },
];

export default function Assignments() {
    const [open,setOpen] = useState(false);
  return (
    <Layout>
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-400">Assignments</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white" onClick = {()=>setOpen(true)}>
          + New Assignment
        </Button>
        {open && <NewAssignmentModal onClose={() => setOpen(false)} />}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-slate-900 border border-slate-800">
          <h2 className="text-sm text-slate-400">Total Assignments</h2>
          <p className="text-2xl font-bold">8</p>
        </Card>
        <Card className="p-6 bg-slate-900 border border-slate-800">
          <h2 className="text-sm text-slate-400">Active Assignments</h2>
          <p className="text-2xl font-bold text-green-400">6</p>
        </Card>
        <Card className="p-6 bg-slate-900 border border-slate-800">
          <h2 className="text-sm text-slate-400">Avg Duration</h2>
          <p className="text-2xl font-bold text-yellow-400">52 min</p>
        </Card>
        <Card className="p-6 bg-slate-900 border border-slate-800">
          <h2 className="text-sm text-slate-400">Total Submissions</h2>
          <p className="text-2xl font-bold text-blue-400">98</p>
        </Card>
      </div>

      {/* List */}
      <h2 className="text-xl font-semibold mb-4">Your Assignments</h2>
      <div className="space-y-4">
        {assignments.map((a) => (
          <Card
            key={a.id}
            className="p-6 bg-slate-900 border border-slate-800 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              {/* Left */}
              <div>
                <h3 className="text-lg font-bold text-white">{a.title}</h3>
                <p className="text-slate-400">{a.role}</p>
                <div className="flex gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileCheck size={14} /> {a.questions} questions
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
                      ? "bg-green-500/10 text-green-400 border border-green-400/30"
                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-400/30"
                  }`}
                >
                  {a.status}
                </span>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </Layout>
  );
}
