import { useAssessmentBuilder } from "@/hooks/useAssessmentBuilder";
import Layout from "@/components/layout";
import Toolbar from "@/components/Toolbar";
import SectionList from "@/components/SectionList";
import QuestionList from "@/components/QuestionList";
import QuestionEditor from "@/components/QuestionEditor";
import Preview from "@/components/LivePreview";
import QuestionTypeModal from "@/components/QuestionTypeModal";

export default function AssessmentBuilder() {
  const builder = useAssessmentBuilder();
  const selectedSection =
    builder.assessment.sections.find(
      (s) => s.id === builder.selectedSectionId
    ) || null;
  const selectedQuestion =
    selectedSection?.questions.find(
      (q) => q.id === builder.selectedQuestionId
    ) || null;

  if (builder.showPreview) {
    return (
      <Layout>
        <Preview builder={builder} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-slate-900 text-white">
        {/* Top Toolbar */}
        <Toolbar builder={builder} />

        {/* Main content (3-column layout) */}
        <div className="flex flex-1 overflow-hidden">
          <SectionList builder={builder} />
          <QuestionList builder={builder} section={selectedSection} />
          <QuestionEditor
            builder={builder}
            section={selectedSection}
            question={selectedQuestion}
          />
        </div>

        {/* Modal for adding new questions */}
        <QuestionTypeModal builder={builder} />
      </div>
    </Layout>
  );
}
