export type QuestionType = 'text' | 'number' | 'select' | '';

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern';
  value?: number | string;
  message: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface NumberFieldConfig {
  min?: number;
  max?: number;
  step?: number;
}

export interface Question {
  id: string;
  questionType?: QuestionType;
  numberType?: string;
  label: string;
  required?: boolean;
  isParagraph?: boolean;
  hidden?: boolean;
  helpText?: string;
  min?: string;
  max?: string;
  expanded?: boolean;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface FormResponse {
  formId: string;
  answers: Record<string, string | number>;
}