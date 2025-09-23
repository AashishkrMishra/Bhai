import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { db, Job } from "@/mock/db";
import NewJobModal from "@/components/JobModal"; // ✅ your create job modal

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);

  // Fetch job by ID
  useEffect(() => {
    async function fetchJob() {
      try {
        if (!id) return;
        const jobData = await db.jobs.get(Number(id));
        setJob(jobData || null);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    await db.jobs.delete(Number(id));
    navigate("/jobs"); // redirect after delete
  }
  async function refreshJobs() {
    const allJobs = await db.jobs.toArray();
    setJob(job);
  }

  async function handleArchive() {
    if (!id || !job) return;
    await db.jobs.update(Number(id), {
      status: job.status === "archived" ? "active" : "archived",
    });
    const updated = await db.jobs.get(Number(id));
    setJob(updated || null);
  }

  if (loading) return <p className="text-gray-400">Loading job details...</p>;
  if (!job) return <p className="text-red-500">Job not found</p>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Top header bar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mt-2">Job Details</h1>
            <p className="text-gray-400 text-sm">
              Manage and view job information
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpenEdit(true)}>
              ✏️ Edit
            </Button>
            <Button variant="outline" onClick={handleArchive}>
              {job.status === "archived" ? "Restore" : "Archive"}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              🗑 Delete
            </Button>
          </div>
        </div>

        {/* Gradient Job Card */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
          <span
            className={`px-2 py-1 rounded text-xs ${
              job.status === "active" ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {job.status}
          </span>
          <h2 className="text-3xl font-bold mt-2">{job.title}</h2>
          <p className="flex gap-4 text-sm mt-1">
            <span>{job.location}</span>
            <span className="px-2 py-0.5 bg-gray-800 rounded">{job.type}</span>
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          {/* Left section */}
          <div className="col-span-2 space-y-6">
            <Card className="p-6 bg-gray-900">
              <h3 className="text-lg font-semibold">Job Description</h3>
              <p className="text-gray-300 mt-2">{job.description}</p>
            </Card>

            <Card className="p-6 bg-gray-900">
              <h3 className="text-lg font-semibold">Requirements</h3>
              <ul className="mt-2 space-y-2">
                {job.requirements?.map((req, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-800 px-3 py-2 rounded text-gray-200"
                  >
                    {req}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-gray-900">
              <h3 className="text-lg font-semibold">Skills & Tags</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Right section */}
          <div className="space-y-6">
            {/* Candidate Pipeline (static for now) */}
            <Card className="p-6 bg-gray-900">
              <h3 className="text-lg font-semibold">Candidate Pipeline</h3>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[
                  { label: "APPLIED", value: 10, color: "bg-blue-600" },
                  { label: "SCREEN", value: 8, color: "bg-yellow-600" },
                  { label: "TECH", value: 4, color: "bg-purple-600" },
                  { label: "OFFER", value: 5, color: "bg-green-600" },
                  { label: "HIRED", value: 7, color: "bg-teal-600" },
                  { label: "REJECTED", value: 7, color: "bg-red-600" },
                ].map((stage) => (
                  <div
                    key={stage.label}
                    className={`p-4 rounded-lg ${stage.color}`}
                  >
                    <p className="text-xs">{stage.label}</p>
                    <p className="text-lg font-bold">{stage.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Job Information */}
            <Card className="p-6 bg-gray-900 text-sm space-y-2">
              <h3 className="text-lg font-semibold">Job Information</h3>
              <p>📅 Created: {new Date().toLocaleString()}</p>
              <p>
                🔗 Slug:{" "}
                {job.slug || job.title.toLowerCase().replace(/\s+/g, "-")}
              </p>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-gray-900">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <Button className="w-full mt-3">👥 View Candidates</Button>
              <Button className="w-full mt-2" variant="outline">
                📑 View Assessments
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Job Modal (prefilled) */}
      {openEdit && (
        <NewJobModal
          open={openEdit} // ✅ pass boolean state
          job={job} // ✅ pass job data
          onClose={() => setOpenEdit(false)}
          onSaved={refreshJobs} // optional: callback to refresh jobs after save
        />
      )}
    </Layout>
  );
}
