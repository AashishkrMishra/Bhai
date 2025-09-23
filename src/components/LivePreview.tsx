import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Preview({ builder }) {
  const { assessment, setShowPreview } = builder;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => setShowPreview(false)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h2 className="font-bold text-xl">{assessment.title}</h2>
      </div>

      {assessment.sections.map((s, si) => (
        <div key={s.id} className="mb-6">
          <h3 className="font-semibold mb-2">{s.title}</h3>
          {s.questions.map((q, qi) => (
            <div key={q.id} className="mb-4 p-3 border rounded-lg">
              <p className="font-medium">
                {si + 1}.{qi + 1} {q.title}
              </p>
              <p className="text-sm text-muted-foreground">{q.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
