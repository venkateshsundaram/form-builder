import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, GripVertical, Trash2, Loader2, Check } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { Question } from '../../types/form';

import { QUESTION_FORMS_JSON } from "../../constants/forms";

import { FormBuilder } from '../../components/FormBuilder';

import { debounce } from '../../utils/api';
import { fetchFormMandatoryFields } from "../../utils/form";

interface QuestionEditorProps {
  question: Question;
  onChange: (question: Question) => void;
  onDelete: (id: string) => void;
  isSaving?: boolean;
  saved?: boolean;
}

export default function QuestionEditor({ question, onChange, onDelete, isSaving, saved }: QuestionEditorProps) {
  const [localQuestion, setLocalQuestion] = useState(question);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formState, setFormState] = useState({ values: {}, touched: {}, errors: {} });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const debouncedHandleInput = debounce(onChange, 300);

  useEffect(() => {
    if (isQuestionValid(localQuestion)) {
      debouncedHandleInput(localQuestion)
    }
  }, [localQuestion, onChange]);

  useEffect(() => {
    if (!localQuestion.label) {
      setIsExpanded(true)
    }
  }, [localQuestion]);

  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      values: {
        title: question.label,
        questionType: question.questionType,
        isParagraph: question.isParagraph,
        numberType: question.numberType,
        min: question.min,
        max: question.max,
        required: question.required,
        hidden: question.hidden,
        helpText: question.helpText
      }
    }));
  }, []);

  const isQuestionValid = (q: Question): boolean => {
    const mandatoryFields = fetchFormMandatoryFields(QUESTION_FORMS_JSON, formState);
    const keys = Object.keys(mandatoryFields);
    return keys.every((key: string) => q[key as keyof typeof q]);
  };

  const getHeaderTitle = () => {
    if (!localQuestion.label) {
      return 'Untitled Question';
    }
    return localQuestion.label;
  };

  const handleFieldChange = (value: any, name: string, data: any) => {

    switch (name) {
      case "title":
        setLocalQuestion(prev => ({
          ...prev,
          label: value,
          title: value
        }));
        break;
      case "questionType":
        setLocalQuestion(prev => ({
          ...prev,
          questionType: value,
          isParagraph: false,
          numberType: "",
          min: "",
          max: ""
        }));
        break;
      case "isParagraph":
        setLocalQuestion(prev => ({
          ...prev,
          isParagraph: value
        }));
        break;
      case "numberType":
        setLocalQuestion(prev => ({
          ...prev,
          numberType: value,
          min: "",
          max: ""
        }));
        break;
      case "min":
        setLocalQuestion(prev => ({
          ...prev,
          min: value
        }));
        break;
      case "max":
        setLocalQuestion(prev => ({
          ...prev,
          max: value
        }));
        break;
      case "required":
        setLocalQuestion(prev => ({
          ...prev,
          required: value
        }));
        break;
      case "hidden":
        setLocalQuestion(prev => ({
          ...prev,
          hidden: value
        }));
        break;
      case "helpText":
        setLocalQuestion(prev => ({
          ...prev,
          helpText: value
        }));
        break;
      default:
        break;
    }
    setFormState(() => data.formState);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "bg-white rounded-lg border shadow-sm overflow-hidden transition-shadow",
        isDragging ? "shadow-lg" : "shadow-sm",
      )}
    >
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab hover:text-gray-700">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
          <span className="text-sm font-medium text-gray-700 truncate max-w-md">
            {getHeaderTitle()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isSaving ? 
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          : saved && isExpanded && <Check className="w-6 h-6 text-green-500" />}
    
          <button
            onClick={() => onDelete(question.id)}
            className="p-1 text-gray-400 hover:text-red-500 rounded-md"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className={clsx("transition-all", !isExpanded && "hidden")}>
        <div className="p-3 border-b">
            <FormBuilder 
              formState={formState}
              id={question.id}
              handleFieldChange={handleFieldChange} 
              formJson={QUESTION_FORMS_JSON}
            />
          </div>
      </div>
    </div>
  );
}