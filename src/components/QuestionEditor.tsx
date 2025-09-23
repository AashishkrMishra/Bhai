import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export default function QuestionEditor({ builder, section, question }) {
  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a question to edit
      </div>
    );
  }

  const update = (updates) => builder.updateQuestion(question.id, updates);

  return (
   <div className="flex-1 bg-slate-900">
      <Input
        value={question.title}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="Question title"
      />
      <Textarea
        value={question.description}
        onChange={(e) => update({ description: e.target.value })}
        placeholder="Description"
      />
      <div className="flex items-center gap-2">
        <Checkbox
          checked={question.required}
          onCheckedChange={(checked) => update({ required: !!checked })}
        />
        <span className="text-sm">Required</span>
      </div>

      {(question.type === "single-choice" || question.type === "multiple-choice") && (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={opt}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[i] = e.target.value;
                  update({ options: newOptions });
                }}
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
            onClick={() => update({ options: [...question.options, `Option ${question.options.length + 1}`] })}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Option
          </Button>
        </div>
      )}
    </div>
  );
}
