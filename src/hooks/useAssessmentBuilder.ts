import { useState, useEffect } from "react";
import { Assessment, Section, Question } from "@/lib/type";
import { loadState, saveState } from "@/lib/storage";

export function useAssessmentBuilder() {
  const [assessment, setAssessment] = useState<Assessment>({
    id: Date.now(),
    title: "New Assessment",
    description: "Describe what this assessment will evaluate...",
    sections: [],
    totalQuestions: 0,
    estimatedDuration: 0
  });

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewResponses, setPreviewResponses] = useState<Record<string, any>>({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // load
  useEffect(() => {
    const saved = loadState<Assessment>("assessment-builder-state");
    if (saved) {
      setAssessment(saved);
      if (saved.sections.length > 0) {
        setSelectedSectionId(saved.sections[0].id);
      }
    }
  }, []);

  // persist & recalc metrics
  useEffect(() => {
    saveState("assessment-builder-state", assessment);
    const totalQuestions = assessment.sections.reduce((sum, s) => sum + s.questions.length, 0);
    const estimatedDuration = Math.max(2, totalQuestions * 2);

    setAssessment(prev => ({ ...prev, totalQuestions, estimatedDuration }));
  }, [assessment.sections]);

  // --- actions ---
  const addSection = () => {
    const newSection: Section = {
      id: Date.now(),
      title: `Section ${assessment.sections.length + 1}`,
      questions: []
    };
    setAssessment(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    setSelectedSectionId(newSection.id);
    setUnsavedChanges(true);
  };

  const updateSection = (id: number, updates: Partial<Section>) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(s => (s.id === id ? { ...s, ...updates } : s))
    }));
    setUnsavedChanges(true);
  };

  const deleteSection = (id: number) => {
    setAssessment(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
    if (selectedSectionId === id) setSelectedSectionId(null);
    setUnsavedChanges(true);
  };

  const addQuestion = (type: Question["type"]) => {
    if (!selectedSectionId) return;
    const section = assessment.sections.find(s => s.id === selectedSectionId);
    if (!section) return;

    const newQuestion: Question = {
      id: Date.now(),
      type,
      title: "",
      description: "",
      required: false,
      options: type.includes("choice") ? ["Option 1", "Option 2"] : [],
      validation: type === "numeric" ? { min: 0, max: 100 } : { maxLength: 200 },
      conditionalLogic: null
    };

    updateSection(selectedSectionId, { questions: [...section.questions, newQuestion] });
    setSelectedQuestionId(newQuestion.id);
    setShowQuestionModal(false);
  };

  const updateQuestion = (qid: number, updates: Partial<Question>) => {
    if (!selectedSectionId) return;
    updateSection(selectedSectionId, {
      questions: assessment.sections
        .find(s => s.id === selectedSectionId)!
        .questions.map(q => (q.id === qid ? { ...q, ...updates } : q))
    });
  };

  const deleteQuestion = (qid: number) => {
    if (!selectedSectionId) return;
    updateSection(selectedSectionId, {
      questions: assessment.sections
        .find(s => s.id === selectedSectionId)!
        .questions.filter(q => q.id !== qid)
    });
    if (selectedQuestionId === qid) setSelectedQuestionId(null);
  };

  const saveAssessment = () => {
    saveState(`assessment-${assessment.id}`, assessment);
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
    saveAssessment
  };
}
