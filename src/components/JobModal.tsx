import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { db, Job,JobType,JobStatus } from "@/mock/db";

type JobForm = {
  id?: number;
  title: string;
  slug?: string;
  location: string;
  type: string;
  status: string;
  description: string;
  requirements: string[];
  tags: string[];
};

export default function JobModal({
  open,
  onClose,
  onSaved, // parent callback after save
  job, // optional for editing
}: {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  job?: Job;
}) {
  const [form, setForm] = useState<JobForm>({
    title: "",
    location: "",
    type: "Full-time",
    status: "Active",
    description: "",
    requirements: [""],
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Prefill form when editing
  useEffect(() => {
    if (job) {
      setForm({
        id: job.id,
        title: job.title,
        slug: job.slug,
        location: job.location,
        type: job.type,
        status: job.status,
        description: job.description,
        requirements: job.requirements || [""],
        tags: job.tags || [],
      });
    }
  }, [job]);

  const handleChange = (field: keyof JobForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updated = [...form.requirements];
    updated[index] = value;
    handleChange("requirements", updated);
  };

  const addRequirement = () => {
    handleChange("requirements", [...form.requirements, ""]);
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      handleChange("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    handleChange(
      "tags",
      form.tags.filter((t) => t !== tag)
    );
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.title.trim()) newErrors.title = "Job title is required.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.type.trim()) newErrors.type = "Job type is required.";
    if (!form.status.trim()) newErrors.status = "Status is required.";
    if (!form.description.trim())
      newErrors.description = "Job description is required.";

    if (!form.tags || form.tags.length === 0) {
      newErrors.tags = "At least one tag is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      if (form.id) {
        // ✅ Update existing job (still use db for PATCH, or you can add PATCH API call here if needed)
        await db.jobs.update(form.id, {
          ...form,
          status: form.status.toLowerCase() as JobStatus,
          type: form.type.toLowerCase() as JobType,
          slug: form.title.toLowerCase().replace(/\s+/g, "-"),
        });
      } else {
        // ✅ Create new job via mock API
        const jobPayload = {
          ...form,
          status: form.status.toLowerCase(),
          type: form.type.toLowerCase(),
          order: Date.now(),
          skills: [], // <-- add this line to satisfy Job interface
        };
        const res = await fetch("/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobPayload),
        });
        if (!res.ok) {
          throw new Error("Failed to create job");
        }
        // Optionally, you can use the returned job data
        // const createdJob = await res.json();
      }

      if (onSaved) onSaved?.();

      onClose();
    } catch (err) {
      console.error("Error saving job:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Custom style for hiding scrollbar and fixing z-index */}
      <style>{`
        .scrollbar-hide {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .job-modal-z {
          z-index: 50 !important;
        }
      `}</style>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white text-slate-900 border border-slate-200 job-modal-z">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">
            {form.id ? "Edit Job" : "Create New Job"}
          </DialogTitle>
          <p className="text-sm text-slate-500">
            {form.id
              ? "Update job details below."
              : "Fill in the details to create a new job posting."}
          </p>
        </DialogHeader>

  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
          {/* Job Title */}
          <div className="ml-4">
            <label className="text-sm text-slate-700 ml-1">Job Title *</label>
            <Input
              required
              placeholder="e.g. Senior Software Engineer"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`bg-white border-slate-300 mt-1 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Location + Type */}
            <div className="grid grid-cols-2 gap-4 ml-4">
              <div>
                <label className="text-sm text-slate-700 ml-1">Location *</label>
                <Input
                  required
                  placeholder="e.g. San Francisco, CA"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className={`bg-white border-slate-300 mt-1 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
                    errors.location ? "border-red-500" : ""
                  }`}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-slate-700 ml-1">Job Type *</label>
              <Select
                required
                value={form.type}
                onValueChange={(val) => handleChange("type", val)}
              >
                <SelectTrigger
                  className={`bg-white border-slate-300 mt-1 text-slate-900 ${
                    errors.type ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="ml-4">
            <label className="text-sm text-slate-700 ml-1">Status *</label>
            <Select
              required
              value={form.status}
              onValueChange={(val) => handleChange("status", val)}
            >
              <SelectTrigger
                className={`bg-white border-slate-300 mt-1 text-slate-900 ${
                  errors.status ? "border-red-500" : ""
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>

          {/* Job Description */}
          <div className="ml-4">
            <label className="text-sm text-slate-700 ml-1">Job Description *</label>
            <Textarea
              required
              placeholder="Describe the role, responsibilities..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`bg-white border-slate-300 mt-1 text-slate-900 ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Requirements */}
          <div className="ml-4">
            <label className="text-sm text-slate-700 ml-1">Requirements *</label>
            <div className="space-y-2">
              {form.requirements.map((req, idx) => (
                <Input
                  required
                  key={idx}
                  placeholder={`Requirement ${idx + 1}`}
                  value={req}
                  onChange={(e) => handleRequirementChange(idx, e.target.value)}
                  className={`bg-white border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
                    errors.requirements ? "border-red-500" : ""
                  }`}
                />
              ))}
            </div>
            {errors.requirements && (
              <p className="text-red-500 text-xs mt-1">{errors.requirements}</p>
            )}
            <Button
              type="button"
              variant="secondary"
              className="mt-2 bg-slate-100 border border-slate-300 text-slate-900"
              onClick={addRequirement}
            >
              + Add Requirement
            </Button>
          </div>

          {/* Tags */}
          <div className="ml-4">
            <label className="text-sm text-slate-700 ml-1">Tags *</label>
            <Input
              placeholder="Type a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="bg-white border-slate-300 mt-1 text-slate-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />
            <div className="flex gap-2 flex-wrap mt-2">
              {form.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center gap-2 text-slate-900 border border-slate-300"
                >
                  {tag}
                  <button
                    className="text-red-500 text-xs"
                    onClick={() => removeTag(tag)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-900">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {loading ? "Saving..." : form.id ? "Update Job" : "Create Job"}
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
