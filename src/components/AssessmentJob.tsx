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
      <main className="flex-1 px-6 pb-6 pt-0 overflow-y-auto bg-slate-50">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-700">Assessments</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Total Assessments</h2>
              <p className="text-2xl font-bold text-slate-800">{total}</p>
            </Card>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Completed</h2>
              <p className="text-2xl font-bold text-green-600">{completed}</p>
            </Card>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">In Progress</h2>
              <p className="text-2xl font-bold text-yellow-500">{inProgress}</p>
            </Card>
            <Card className="p-6 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm text-slate-500">Pending</h2>
              <p className="text-2xl font-bold text-red-600">{pending}</p>
            </Card>
          </div>

          {/* List */}
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Your Assessments</h2>
          {assessments.length === 0 ? (
            <p className="text-slate-400">No assessments found.</p>
          ) : (
            <div className="space-y-4">
              {assessments.map((a) => (
                <Card
                  key={a.id}
                  className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-lg transition rounded-xl flex justify-between items-center cursor-pointer"
                >
                  {/* Left */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{a.title}</h3>
                    <p className="text-slate-500">Candidate ID: {a.candidateId}</p>
                  </div>
                  {/* Right */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      a.status === "Completed"
                        ? "bg-green-100 text-green-600 border border-green-200"
                        : a.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {a.status}
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