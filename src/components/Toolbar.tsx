import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Eye, File, LoaderCircle } from "lucide-react";

export default function Toolbar({ builder, onSave, saving }: any) {
  // A placeholder function for the "Save Draft" button
  const handleSaveDraft = () => {
    console.log("Draft saved!");
    // You can implement the draft saving logic here
  };
  
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 bg-white shadow-sm">
      {/* Left Section: Title and Role */}
      <div className="flex items-center gap-4 flex-shrink min-w-0">
        <input
          className="text-lg font-bold bg-transparent focus:outline-none focus:ring-0 border-none p-0 text-slate-800 placeholder-slate-400 truncate"
          value={builder.assessment.title}
          onChange={(e) =>
            builder.setAssessment((prev: any) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          placeholder="Assessment title"
        />
        <span className="px-3 py-1 rounded-md font-semibold bg-slate-100 text-slate-600 border border-slate-200 text-sm whitespace-nowrap">
          {builder.assessment.role}
        </span>
      </div>

      {/* Right Section: Status and Actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge
          className={`capitalize font-semibold text-xs border transition-colors ${
            builder.assessment.status === "Active"
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        >
          {builder.assessment.status}
        </Badge>
        
        <Button
          variant="outline"
          className="text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 transform transition-all shadow-sm hover:shadow-md"
          onClick={handleSaveDraft}
        >
          <File className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
        
        <Button
          variant="outline"
          className="text-slate-700 bg-white border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 transform transition-all shadow-sm hover:shadow-md"
          onClick={() => builder.setShowPreview(true)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-0.5 transform transition-all shadow-md hover:shadow-lg"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? "Saving..." : "Save & Publish"}
        </Button>
      </div>
    </div>
  );
}

