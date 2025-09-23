export type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "short-text"
  | "long-text"
  | "numeric"
  | "file-upload";

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  description: string;
  required: boolean;
  options: string[];
  validation: Record<string, any>;
  conditionalLogic: any;
}

export interface Section {
  id: number;
  title: string;
  questions: Question[];
}

export interface Assessment {
  id: number;
  title: string;
  description: string;
  sections: Section[];
  totalQuestions: number;
  estimatedDuration: number;
}
