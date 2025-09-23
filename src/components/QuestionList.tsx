import { Plus, Trash2, Type, Square, CheckSquare, Hash, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuestionList({ builder, section }) {
  const { selectedQuestionId, setSelectedQuestionId, deleteQuestion, setShowQuestionModal } = builder;

  if (!section) {
    return (
      <div className="w-1/4 border-r p-4 flex flex-col justify-center items-center text-muted-foreground">
        <p>Select a section to add questions</p>
      </div>
    );
  }

  return (
    <div className="w-1/4 border-r border-slate-800 bg-slate-900">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Questions</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowQuestionModal(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {section.questions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No questions yet.</p>
      ) : (
        <div className="space-y-2">
          {section.questions.map((q, idx) => (
            <div
              key={q.id}
              className={`rounded-lg border p-3 cursor-pointer ${
                selectedQuestionId === q.id ? "border-green-500 bg-green-500/10" : "hover:border-muted"
              }`}
              onClick={() => setSelectedQuestionId(q.id)}
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Q{idx + 1}</span>
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
              <p className="text-sm font-medium">{q.title || "Untitled Question"}</p>
              {q.required && <span className="text-xs text-red-500">Required</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
