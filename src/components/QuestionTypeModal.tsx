import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const types = [
  { key: "single-choice", label: "Single Choice" },
  { key: "multiple-choice", label: "Multiple Choice" },
  { key: "short-text", label: "Short Text" },
  { key: "long-text", label: "Long Text" },
  { key: "numeric", label: "Numeric" },
  { key: "file-upload", label: "File Upload" },
];

export default function QuestionTypeModal({ builder }) {
  return (
    <Dialog open={builder.showQuestionModal} onOpenChange={builder.setShowQuestionModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Question Type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {types.map((t) => (
            <Button key={t.key} onClick={() => builder.addQuestion(t.key as any)}>
              {t.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}