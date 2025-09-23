import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

// dummy jobs
const jobs = [
  { id: 1, title: "Rust Developer", location: "Boston, MA", status: "active" },
  { id: 2, title: "Java Developer", location: "Miami, FL", status: "active" },
  { id: 3, title: "React Engineer", location: "Remote", status: "active" },
  { id: 3, title: "React Engineer", location: "Remote", status: "active" },
  { id: 3, title: "React Engineer", location: "Remote", status: "active" },
];

export default function NewAssignmentModal({ onClose }: Props) {
  const navigate = useNavigate();

  const handleSelect = (type: "general" | number) => {
    onClose();
    if (type === "general") {
      navigate("/assignments/build/general");
    } else {
      navigate(`/assignments/build/${type}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-slate-900 text-white border border-slate-700 rounded-lg shadow-lg w-[450px] max-h-[80vh] overflow-y-auto relative">
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

          {/* Jobs list */}
          <p className="text-sm text-slate-400 mb-2">Or choose a job:</p>
          <div className="space-y-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleSelect(job.id)}
                className="p-3 border border-slate-700 rounded-lg cursor-pointer hover:border-purple-500 transition"
              >
                <h4 className="font-medium text-white">{job.title}</h4>
                <p className="text-xs text-slate-400">{job.location}</p>
                <span className="text-xs mt-1 inline-block bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-400/30">
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
