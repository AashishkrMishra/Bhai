import { Plus, Trash2, Type, Square, CheckSquare, Hash, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuestionList({ builder, section }) {
  const {
    selectedQuestionId,
    setSelectedQuestionId,
    deleteQuestion,
    setShowQuestionModal,
  } = builder;

  if (!section) {
    return (
      <div className="w-1/4 border-r border-slate-200 bg-white px-4 py-6 flex flex-col justify-center items-center min-h-screen">
        <p className="text-slate-400">Select a section to add questions</p>
      </div>
    );
  }

  return (
    <div className="w-1/4 border-r border-slate-200 bg-white px-4 py-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-700">Questions</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowQuestionModal(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {section.questions.length === 0 ? (
        <p className="text-slate-400 text-sm">No questions yet.</p>
      ) : (
        <div className="space-y-2">
          {section.questions.map((q, idx) => (
            <div
              key={q.id}
              className={`rounded-lg border p-3 cursor-pointer transition ${
                selectedQuestionId === q.id
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 hover:border-slate-400"
              }`}
              onClick={() => setSelectedQuestionId(q.id)}
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Q{idx + 1}</span>
                  {q.type === "single-choice" && <Square className="h-3 w-3 text-blue-500" />}
                  {q.type === "multiple-choice" && <CheckSquare className="h-3 w-3 text-blue-500" />}
                  {q.type === "short-text" && <Type className="h-3 w-3 text-blue-500" />}
                  {q.type === "long-text" && <Type className="h-3 w-3 text-blue-500" />}
                  {q.type === "numeric" && <Hash className="h-3 w-3 text-blue-500" />}
                  {q.type === "file-upload" && <FileUp className="h-3 w-3 text-blue-500" />}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(q.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <p className="text-sm font-medium text-slate-700">{q.title || "Untitled Question"}</p>
              {q.required && <span className="text-xs text-red-500">Required</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}