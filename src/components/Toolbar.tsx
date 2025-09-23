import { Eye, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Toolbar({ builder }) {
  return (
    <div className="flex justify-between items-center border-b p-4">
      <div className="flex items-center gap-2">
        <ArrowLeft size={20} />
        <h2 className="font-semibold">Assessment Builder</h2>
      </div>
      <div className="flex gap-2">
        {builder.unsavedChanges && <span className="text-orange-500">Unsaved Changes</span>}
        <Button variant="outline" onClick={() => builder.setShowPreview(true)}>
          <Eye className="mr-2 h-4 w-4" /> Preview
        </Button>
        <Button onClick={builder.saveAssessment}>
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  );
}
