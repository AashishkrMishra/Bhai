import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout";
import { Card } from "@/components/ui/card";
import { ListChecks, Clock, CheckCircle, XCircle } from "lucide-react";

type Assignment = {
  id: number;
  title: string;
  candidateId: number;
  status: "Completed" | "In Progress" | "Pending";
};

export default function AssessmentsJob() {
  const { jobId } = useParams();
  const [assessments, setAssessments] = useState<Assignment[]>([]);

  // ✅ Fetch from API
  useEffect(() => {
    (async () => {
      const res = await fetch(`/jobs/${jobId}/assignments`);
      const data = await res.json();
      setAssessments(data.assignments);
    })();
  }, [jobId]);

  // ✅ Stats
  const total = assessments.length;
  const completed = assessments.filter((a) => a.status === "Completed").length;
  const inProgress = assessments.filter((a) => a.status === "In Progress").length;
  const pending = assessments.filter((a) => a.status === "Pending").length;

  return (
    <Layout>
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Assessments</h1>
        <p className="text-slate-400 mb-6">
          Track assignments and their progress
        </p>

        {/* ✅ Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-slate-900 border border-slate-800 flex items-center gap-3">
            <ListChecks className="text-blue-400" />
            <div>
              <p className="text-sm text-slate-400">Total Assessments</p>
              <h2 className="text-xl font-bold">{total}</h2>
            </div>
          </Card>
          <Card className="p-4 bg-slate-900 border border-slate-800 flex items-center gap-3">
            <CheckCircle className="text-green-400" />
            <div>
              <p className="text-sm text-slate-400">Completed</p>
              <h2 className="text-xl font-bold">{completed}</h2>
            </div>
          </Card>
          <Card className="p-4 bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Clock className="text-yellow-400" />
            <div>
              <p className="text-sm text-slate-400">In Progress</p>
              <h2 className="text-xl font-bold">{inProgress}</h2>
            </div>
          </Card>
          <Card className="p-4 bg-slate-900 border border-slate-800 flex items-center gap-3">
            <XCircle className="text-red-400" />
            <div>
              <p className="text-sm text-slate-400">Pending</p>
              <h2 className="text-xl font-bold">{pending}</h2>
            </div>
          </Card>
        </div>

        {/* ✅ List */}
        <div className="grid gap-4 grid-cols-1">
          {assessments.map((a) => (
            <Card
              key={a.id}
              className="p-4 bg-slate-900 border border-slate-800 cursor-pointer hover:shadow-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{a.title}</h2>
                  <p className="text-slate-400 text-sm">
                    Candidate ID: {a.candidateId}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full capitalize ${
                    a.status === "Completed"
                      ? "bg-green-600"
                      : a.status === "In Progress"
                      ? "bg-yellow-600"
                      : "bg-slate-600"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}