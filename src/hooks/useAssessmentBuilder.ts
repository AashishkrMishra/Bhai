import { useState, useEffect } from "react";
import { Assessment, Section, Question } from "@/mock/type";
import { loadState, saveState, removeState } from "@/lib/storage";

export function useAssessmentBuilder(initialAssessment?: Assessment) {
  // --- default assessment template ---
  const defaultAssessment: Assessment = {
    id: Date.now(),
    jobId: Date.now(), // placeholder link to job
    title: "New Assessment",
    description: "Describe what this assessment will evaluate...",
    role: "Untitled Role",
    duration: "0 mins",
    submissions: 0,
    status: "Draft",
    sections: [],
    totalQuestions: 0,
  };

  // --- initialize state safely ---
  const [assessment, setAssessment] = useState<Assessment>(() => {
    if (initialAssessment) {
      return {
        ...initialAssessment,
        sections: initialAssessment.sections || [],
      };
    }
    return defaultAssessment;
  });

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewResponses, setPreviewResponses] = useState<Record<string, any>>({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // --- load draft or saved state on init ---
  useEffect(() => {
    if (!initialAssessment) {
      try {
        const draft = loadState<Assessment>("assessment-draft");
        const saved = loadState<Assessment>("assessment-builder-state");
        const source = draft || saved;

        if (source) {
          setAssessment({
            ...source,
            sections: source.sections || [],
          });
          if (source.sections && source.sections.length > 0) {
            setSelectedSectionId(source.sections[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load draft/saved assessment:", err);
      }
    } else if (initialAssessment.sections?.length > 0) {
      setSelectedSectionId(initialAssessment.sections[0].id);
    }
  }, [initialAssessment]);

  // --- recalc metrics & autosave ---
  useEffect(() => {
    const totalQuestions = (assessment.sections || []).reduce(
      (sum, s) => sum + (s.questions?.length || 0),
      0
    );
    const estimatedMinutes = Math.max(2, totalQuestions * 2);
    const newDuration = `${estimatedMinutes} mins`;

    if (
      assessment.totalQuestions !== totalQuestions ||
      assessment.duration !== newDuration
    ) {
      setAssessment((prev) => ({
        ...prev,
        totalQuestions,
        duration: newDuration,
      }));
    }

    try {
      saveState("assessment-builder-state", assessment);
    } catch (err) {
      console.error("Failed to autosave builder state:", err);
    }
  }, [assessment.sections]);

  // --- actions ---
  const addSection = () => {
    const newSection: Section = {
      id: Date.now(),
      title: `Section ${(assessment.sections || []).length + 1}`,
      questions: [],
    };
    setAssessment((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
    setSelectedSectionId(newSection.id);
    setUnsavedChanges(true);
  };

  const updateSection = (id: number, updates: Partial<Section>) => {
    setAssessment((prev) => ({
      ...prev,
      sections: (prev.sections || []).map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
    setUnsavedChanges(true);
  };

  const deleteSection = (id: number) => {
    setAssessment((prev) => ({
      ...prev,
      sections: (prev.sections || []).filter((s) => s.id !== id),
    }));
    if (selectedSectionId === id) setSelectedSectionId(null);
    setUnsavedChanges(true);
  };

  const addQuestion = (type: Question["type"]) => {
    if (!selectedSectionId) return;
    const section = assessment.sections.find((s) => s.id === selectedSectionId);
    if (!section) return;

    const newQuestion: Question = {
      id: Date.now(),
      type,
      title: "",
      options: type.includes("choice") ? ["Option 1", "Option 2"] : undefined,
      validationRules:
        type === "numeric"
          ? { min: 0, max: 100, required: false }
          : type === "short-text"
          ? { maxLength: 100, required: false }
          : type === "long-text"
          ? { maxLength: 500, required: false }
          : { required: false },
      conditional: undefined,
    };

    if (type === "file-upload") {
      newQuestion.validationRules = {
        required: false,
        allowedTypes: ["pdf", "jpg", "png"],
        maxSizeMB: 5,
      };
    }

    updateSection(selectedSectionId, {
      questions: [...(section.questions || []), newQuestion],
    });
    setSelectedQuestionId(newQuestion.id);
    setShowQuestionModal(false);
    setUnsavedChanges(true);
  };

  const updateQuestion = (qid: number, updates: Partial<Question>) => {
    if (!selectedSectionId) return;
    updateSection(selectedSectionId, {
      questions: assessment.sections
        .find((s) => s.id === selectedSectionId)!
        .questions.map((q) => (q.id === qid ? { ...q, ...updates } : q)),
    });
    setUnsavedChanges(true);
  };

  const deleteQuestion = (qid: number) => {
    if (!selectedSectionId) return;
    updateSection(selectedSectionId, {
      questions: assessment.sections
        .find((s) => s.id === selectedSectionId)!
        .questions.filter((q) => q.id !== qid),
    });
    if (selectedQuestionId === qid) setSelectedQuestionId(null);
    setUnsavedChanges(true);
  };

  // --- conditional linking ---
  const setConditional = (qid: number, dependsOn: number, value: any) => {
    updateQuestion(qid, { conditional: { dependsOn, value } });
  };

  // --- save draft ---
  const saveDraft = () => {
    try {
      saveState("assessment-draft", assessment);
      setUnsavedChanges(false);
    } catch (err) {
      console.error("Failed to save draft:", err);
    }
  };

  // --- clear draft ---
  const clearDraft = () => {
    try {
      removeState("assessment-draft");
    } catch (err) {
      console.error("Failed to clear draft:", err);
    }
  };

  // --- local save (per-assessment id) ---
  const saveAssessment = () => {
    try {
      saveState(`assessment-${assessment.id}`, assessment);
      setUnsavedChanges(false);
    } catch (err) {
      console.error("Failed to save assessment locally:", err);
    }
  };

  const markSaved = (updated?: Assessment) => {
    if (updated) {
      setAssessment({
        ...updated,
        sections: updated.sections || [],
      });
    }
    setUnsavedChanges(false);
  };

  return {
    assessment,
    selectedSectionId,
    selectedQuestionId,
    showQuestionModal,
    showPreview,
    previewResponses,
    unsavedChanges,
    setAssessment,
    setSelectedSectionId,
    setSelectedQuestionId,
    setShowQuestionModal,
    setShowPreview,
    setPreviewResponses,
    addSection,
    updateSection,
    deleteSection,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setConditional,
    saveAssessment,
    saveDraft,
    clearDraft,
    markSaved,
  };
}