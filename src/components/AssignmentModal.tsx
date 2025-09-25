import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Job = {
  id: number;
  title: string;
  location?: string;
  status?: string;
};

type Props = {
  onClose: () => void;
};

export default function NewAssignmentModal({ onClose }: Props) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 5; // you can adjust

  // Fetch jobs from backend
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        if (search.trim()) params.append("search", search);

        const res = await fetch(`/jobs?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const { data, total } = await res.json();

        if (active) {
          setJobs(data);
          setTotal(total);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [search, page]);

  const handleSelect = (type: "general" | number) => {
    onClose();
    if (type === "general") {
      navigate("/assessments/build/general");
    } else {
      navigate(`/assessments/build/${type}`);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-slate-900 text-white border border-slate-700 rounded-lg shadow-lg w-[480px] max-h-[85vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-lg font-bold text-purple-400 mb-4">
            Select Assignment Type
          </h2>

          {/* General option */}
          <div
            onClick={() => handleSelect("general")}
            className="cursor-pointer p-4 border border-slate-700 rounded-lg mb-4 hover:border-purple-500 transition"
          >
            <h3 className="font-semibold text-white">🌀 Standalone Assignment</h3>
            <p className="text-sm text-slate-400">
              Create a general assignment for any position
            </p>
          </div>

          <hr className="border-slate-700 my-3" />

          {/* Search box */}
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to first page on search
            }}
            className="w-full mb-4 px-3 py-2 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />

          {/* Jobs list */}
          <p className="text-sm text-slate-400 mb-2">Or choose a job:</p>

          {loading ? (
            <p className="text-slate-500 text-sm">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-slate-500 text-sm">No jobs found</p>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleSelect(job.id)}
                  className="p-3 border border-slate-700 rounded-lg cursor-pointer hover:border-purple-500 transition"
                >
                  <h4 className="font-medium text-white">{job.title}</h4>
                  <p className="text-xs text-slate-400">{job.location}</p>
                  {job.status && (
                    <span
                      className={`text-xs mt-1 inline-block px-2 py-0.5 rounded border ${
                        job.status === "active"
                          ? "bg-green-500/10 text-green-400 border-green-400/30"
                          : "bg-slate-700 text-slate-300 border-slate-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-xs text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}