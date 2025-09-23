import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SectionList({ builder }) {
  const { assessment, selectedSectionId, setSelectedSectionId, addSection, updateSection, deleteSection } = builder;

  return (
    
        <div className="w-1/4 border-r border-slate-800 bg-slate-950">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Sections</h3>
        <Button variant="ghost" size="sm" onClick={addSection}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {assessment.sections.length === 0 ? (
        <p className="text-muted-foreground text-sm">No sections yet. Create one to start.</p>
      ) : (
        <div className="space-y-2">
          {assessment.sections.map((s) => (
            <div
              key={s.id}
              className={`rounded-lg border p-3 cursor-pointer ${
                selectedSectionId === s.id ? "border-primary bg-primary/10" : "hover:border-muted"
              }`}
              onClick={() => setSelectedSectionId(s.id)}
            >
              <div className="flex items-center gap-2">
                <Input
                  value={s.title}
                  onChange={(e) => updateSection(s.id, { title: e.target.value })}
                  className="flex-1 h-7 text-sm"
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
              <p className="text-xs text-muted-foreground mt-1">{s.questions.length} questions</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
