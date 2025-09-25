import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PreviewProps = {
  assessment?: any;
  builder?: any;
  onBack?: () => void;
};

export default function Preview({ assessment, builder, onBack }: PreviewProps) {
  const data = builder ? builder.assessment : assessment;
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!data) return <p>No assessment found.</p>;

  const validate = (q: any, value: any): string => {
    if (q.required && (value == null || value === "" || (Array.isArray(value) && !value.length))) {
      return "This field is required";
    }
    if (q.type === "numeric") {
      if (q.min != null && value < q.min) return `Must be at least ${q.min}`;
      if (q.max != null && value > q.max) return `Must be at most ${q.max}`;
    }
    if ((q.type === "short-text" || q.type === "long-text") && q.maxLength) {
      if (value?.length > q.maxLength) return `Max ${q.maxLength} characters`;
    }
    if (q.type === "file-upload" && value) {
      if (q.maxSize && value.size / 1024 / 1024 > q.maxSize)
        return `File too large (max ${q.maxSize} MB)`;
      if (q.fileTypes?.length && !q.fileTypes.includes(value.type))
        return `Invalid file type (allowed: ${q.fileTypes.join(", ")})`;
    }
    return "";
  };

  const handleChange = (qid: number, value: any) => {
    setResponses((prev) => ({ ...prev, [qid]: value }));
    setErrors((prev) => ({ ...prev, [qid]: validate(findQuestion(qid), value) }));
  };

  const findQuestion = (qid: number) => {
    for (const s of data.sections || []) {
      for (const q of s.questions || []) {
        if (q.id === qid) return q;
      }
    }
    return null;
  };

  const isVisible = (q: any) => {
    if (!q.dependsOn) return true;
    const answer = responses[q.dependsOn];
    return answer === q.expectedValue;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="text-slate-500">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}
          <h1 className="text-3xl font-bold" style={{ color: '#0d9488' }}>Assessment Preview</h1>
        </div>
      </div>

      {/* Assessment Info */}
      <Card className="bg-white p-6 mb-8 shadow border border-slate-200">
        <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
        {data.description && (
          <p className="text-slate-500 mb-4">{data.description}</p>
        )}

        <div className="flex gap-4 text-sm">
          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
            {data.sections?.length || 0} sections
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
            {data.totalQuestions || 0} questions
          </span>
          {data.duration && (
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
              ~{data.duration}
            </span>
          )}
        </div>
      </Card>

      {/* Sections + Questions */}
      {data.sections?.map((s: any, si: number) => (
        <div key={s.id} className="mb-8">
          {/* Section Header */}
          <div className="rounded-t-xl p-4 text-white shadow" style={{ background: '#0d9488' }}>
            <h3 className="text-lg font-semibold">
              Section {si + 1}: {s.title}
            </h3>
            <p className="text-sm opacity-80">
              {s.questions?.length || 0} questions in this section
            </p>
          </div>

          {/* Section Questions */}
          <div className="bg-white p-4 rounded-b-xl border border-slate-200">
            {s.questions?.map((q: any, qi: number) =>
              isVisible(q) ? (
                <div
                  key={q.id}
                  className="mb-6 p-4 bg-slate-50 rounded-lg shadow"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold" style={{ color: '#0d9488' }}>
                      {si + 1}.{qi + 1}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-200 text-slate-600">
                      {q.type || "text"}
                    </span>
                  </div>

                  <p className="font-medium text-slate-900 mb-1">{q.title}</p>
                  {q.description && (
                    <p className="text-sm text-slate-500 mb-3">
                      {q.description}
                    </p>
                  )}

                  {/* Candidate input (live) */}
                  {renderInput(q, responses[q.id], (val) =>
                    handleChange(q.id, val)
                  )}

                  {/* Live error */}
                  {errors[q.id] && (
                    <p className="text-red-500 text-sm mt-2">{errors[q.id]}</p>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      ))}

      {/* Submit (disabled in preview) */}
      <div className="text-center mt-10">
        <Button disabled className="opacity-50 cursor-not-allowed bg-slate-300 text-slate-500">
          Submit Assessment
        </Button>
        <p className="text-sm text-slate-500 mt-2">
          This is a preview of how the assessment will appear to candidates
        </p>
      </div>
    </div>
  );
}

/* --- Helpers --- */
function renderInput(q: any, value: any, onChange: (val: any) => void) {
  switch (q.type) {
    case "single-choice":
      return (
        <div className="space-y-2">
          {q.options?.map((opt: string, i: number) => (
            <label key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="radio"
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    case "multiple-choice":
      return (
        <div className="space-y-2">
          {q.options?.map((opt: string, i: number) => (
            <label key={i} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={value?.includes(opt)}
                onChange={(e) => {
                  const newVal = new Set(value || []);
                  if (e.target.checked) newVal.add(opt);
                  else newVal.delete(opt);
                  onChange(Array.from(newVal));
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    case "short-text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Short text response..."
          className="w-full px-3 py-2 rounded bg-white border border-slate-300 text-slate-700 text-sm"
        />
      );
    case "long-text":
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Long text response..."
          className="w-full px-3 py-2 rounded bg-white border border-slate-300 text-slate-700 text-sm"
        />
      );
    case "numeric":
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="Numeric response..."
          className="w-full px-3 py-2 rounded bg-white border border-slate-300 text-slate-700 text-sm"
        />
      );
    case "file-upload":
      return (
        <input
          type="file"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="w-full text-sm text-slate-700"
        />
      );
    default:
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Candidate's response..."
          className="w-full px-3 py-2 rounded bg-white border border-slate-300 text-slate-700 text-sm"
        />
      );
  }
}