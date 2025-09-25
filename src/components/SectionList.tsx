import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SectionList({ builder }) {
  const {
    assessment,
    selectedSectionId,
    setSelectedSectionId,
    addSection,
    updateSection,
    deleteSection,
  } = builder;

  return (
    <div className="w-1/4 border-r border-slate-200 bg-white px-4 py-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-700">Sections</h3>
        <Button variant="ghost" size="sm" onClick={addSection}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {assessment.sections.length === 0 ? (
        <p className="text-slate-400 text-sm">No sections yet. Create one to start.</p>
      ) : (
        <div className="space-y-2">
          {assessment.sections.map((s) => (
            <div
              key={s.id}
              className={`rounded-lg border p-3 cursor-pointer transition ${
                selectedSectionId === s.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 hover:border-slate-400"
              }`}
              onClick={() => setSelectedSectionId(s.id)}
            >
              <div className="flex items-center gap-2">
                <Input
                  value={s.title}
                  onChange={(e) => updateSection(s.id, { title: e.target.value })}
                  className="flex-1 h-7 text-sm bg-white border-slate-200"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSection(s.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-1">{s.questions.length} questions</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}