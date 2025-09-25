import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuestionEditor({ builder, section, question }) {
  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50">
        Select a question to edit
      </div>
    );
  }

  const update = (updates) => builder.updateQuestion(question.id, updates);

  return (
    <div className="flex-1 bg-white p-6 space-y-6 overflow-y-auto border-l border-slate-200">
      {/* Title + Description */}
      <Input
        value={question.title}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="Question title"
        className="bg-slate-50"
      />
      <Textarea
        value={question.description}
        onChange={(e) => update({ description: e.target.value })}
        placeholder="Description"
        className="bg-slate-50"
      />

      {/* Required toggle */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={question.required}
          onCheckedChange={(checked) => update({ required: !!checked })}
        />
        <span className="text-sm text-slate-700">Required</span>
      </div>

      {/* Options for MCQs */}
      {(question.type === "single-choice" || question.type === "multiple-choice") && (
        <div className="space-y-2">
          <Label className="text-sm text-slate-700">Options</Label>
          {question.options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={opt}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[i] = e.target.value;
                  update({ options: newOptions });
                }}
                className="bg-slate-50"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  update({ options: question.options.filter((_, idx) => idx !== i) });
                }}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              update({
                options: [...(question.options || []), `Option ${question.options.length + 1}`],
              })
            }
            className="text-slate-700"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Option
          </Button>
        </div>
      )}

      {/* Validation Rules */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <Label className="text-sm text-slate-700">Validation Rules</Label>

        {question.type === "numeric" && (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={question.min ?? ""}
              onChange={(e) => update({ min: e.target.value ? Number(e.target.value) : null })}
              className="bg-slate-50"
            />
            <Input
              type="number"
              placeholder="Max"
              value={question.max ?? ""}
              onChange={(e) => update({ max: e.target.value ? Number(e.target.value) : null })}
              className="bg-slate-50"
            />
          </div>
        )}

        {(question.type === "short-text" || question.type === "long-text") && (
          <Input
            type="number"
            placeholder="Max Length"
            value={question.maxLength ?? ""}
            onChange={(e) => update({ maxLength: e.target.value ? Number(e.target.value) : null })}
            className="bg-slate-50"
          />
        )}

        {question.type === "file-upload" && (
          <div className="space-y-2">
            <Input
              placeholder="Allowed file types (comma separated, e.g. pdf,jpg,png)"
              value={question.fileTypes?.join(",") || ""}
              onChange={(e) => update({ fileTypes: e.target.value.split(",").map((s) => s.trim()) })}
              className="bg-slate-50"
            />
            <Input
              type="number"
              placeholder="Max file size (MB)"
              value={question.maxSize ?? ""}
              onChange={(e) => update({ maxSize: e.target.value ? Number(e.target.value) : null })}
              className="bg-slate-50"
            />
          </div>
        )}
      </div>

      {/* Conditional Logic */}
      <div className="space-y-2 border-t border-slate-200 pt-4">
        <Label className="text-sm text-slate-700">Conditional Logic</Label>
        <Select
          value={question.dependsOn || ""}
          onValueChange={(val) => update({ dependsOn: val || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Depends on question..." />
          </SelectTrigger>
          <SelectContent>
            {section?.questions
              .filter((q) => q.id !== question.id)
              .map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  {q.title || `Question ${q.id}`}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {question.dependsOn && (
          <Input
            placeholder="Expected value (e.g. Yes, Option A, >10)"
            value={question.expectedValue || ""}
            onChange={(e) => update({ expectedValue: e.target.value })}
            className="bg-slate-50"
          />
        )}
      </div>
    </div>
  );
}