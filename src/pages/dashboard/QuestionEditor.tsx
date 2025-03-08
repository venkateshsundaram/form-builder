import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, GripVertical, Trash2, Loader2, Check } from 'lucide-react';
import { toast } from "react-hot-toast";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

import { Question } from '../../types/form';

import { fetchQuestionFormJson } from "../../constants/forms";
import { DEFAULT_SELECT_OPTIONS, DEFAULT_FORM_VALUES } from "../../constants/application";
import { FormBuilder } from '../../components/FormBuilder';

import { debounce } from '../../utils/api';
import { fetchFormMandatoryFields, disbleFormAttr } from "../../utils/form";

interface QuestionEditorProps {
  question: Question;
  onChange: (question: Question) => void;
  onDelete: (id: string) => void;
  resetSavedStaus: () => void;
  isSaving?: boolean;
  saved?: boolean;
}

export default function QuestionEditor({ question, onChange, onDelete, isSaving, saved, resetSavedStaus }: QuestionEditorProps) {
  const [localQuestion, setLocalQuestion] = useState(question);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formState, setFormState] = useState(DEFAULT_FORM_VALUES);
  const [formJson, setFormJson] = useState<any>();
  const [savedState, setSavingState] = useState(saved);
  const [selectedOptions, setSelectedOptions] = useState<any>(DEFAULT_SELECT_OPTIONS);
  const [onChangeTouched, setOnChangeTouched] = useState(false);
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

  const debouncedHandleInput = debounce(onChange, 500);

  useEffect(() => {
    if (onChangeTouched && isQuestionValid(localQuestion)) {
      debouncedHandleInput(localQuestion)
    }
  }, [localQuestion, onChange, onChangeTouched]);

  useEffect(() => {
    setSavingState(saved);
    if (saved) {
      toast.success('Question saved');
    }
  }, [saved])

  useEffect(() => {
    if (!localQuestion.label) {
      setIsExpanded(true)
    }
  }, [localQuestion]);

  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      values: {
        ...question,
        title: question.label,
        questionType: question.questionType,
        isParagraph: question.isParagraph,
        numberType: question.numberType,
        min: question.min,
        max: question.max,
        required: question.isRequired,
        hidden: question.isHidden,
        helpText: question.helpText
      }
    }));
    const questionKeys = Object.keys(question);
    const selectedOptionKeys = questionKeys.filter((key)=> key.includes("selectOption") && question[key as keyof typeof question]);
    let newOptions = selectedOptionKeys.length >0 ? selectedOptionKeys.map((key: string) => {
      return {
        layout: "horizontal",
        attributes: [{
          name: key,
          label: "Option",
          required: true,
          type: "text"
        }, {
          name: `delete${key}`,
          label: "Remove",
          type: "button",
          color: "red"
        }]
      }
    }) : selectedOptions;
    newOptions = disbleFormAttr(newOptions);
    setSelectedOptions(newOptions)
    setFormJson(fetchQuestionFormJson({ selectedOptions: newOptions }));
  }, []);

  const isQuestionValid = (q: Question): boolean => {
    const mandatoryFields = fetchFormMandatoryFields(formJson, formState);
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
    let newValues: any = {};

    if (name.includes("deleteselectOption")) {
      let newOptions = selectedOptions.filter((option: any) => option.attributes[1].name !== name);
      const key = name.replace("delete", "").trim();
      newValues = {
        [key]: ""
      }
      setLocalQuestion(prev => ({
        ...prev,
        [key]: ""
      }));
      setOnChangeTouched(true);
      newOptions = disbleFormAttr(newOptions);
      setSelectedOptions(newOptions);
      setFormJson(fetchQuestionFormJson({ selectedOptions: newOptions }));
    } else if (name.includes("addOption")) {
      let newOptions = selectedOptions.concat({
        layout: "horizontal",
        attributes: [{
          name: `selectOption${selectedOptions.length + 1}`,
          label: "Option",
          required: true,
          type: "text"
        }, {
          name: `deleteselectOption${selectedOptions.length + 1}`,
          label: "Remove",
          type: "button",
          color: "red"
        }]
      });
      newOptions = disbleFormAttr(newOptions);
      setSelectedOptions(newOptions);
      setFormJson(fetchQuestionFormJson({ selectedOptions: newOptions }));
    }  else {
      switch (name) {
        case "title":
          newValues = {
            label: value,
            title: value
          };
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          break;
        case "questionType":
          newValues = {
            questionType: value,
            isParagraph: false,
            numberType: "",
            min: "",
            max: ""
          };
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          resetSavedStaus();
          break;
        case "isParagraph":
          newValues = {
            isParagraph: value
          }
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          break;
        case "numberType":
          newValues = {
            numberType: value,
            min: "",
            max: ""
          }
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          resetSavedStaus();
          break;
        case "min":
          newValues = {
            min: value
          }
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          break;
        case "max":
          newValues = {
            max: value
          }
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          break;
        case "required":
          newValues = {
            required: value
          }
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          break;
        case "hidden":
          newValues = {
            hidden: value
          }
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          break;
        case "helpText":
          newValues = {
            helpText: value
          }
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          break;
        default:
          newValues = {
            [name]: value
          }
          setLocalQuestion(prev => ({
            ...prev,
            ...newValues
          }));
          break;
      }
      const mandatoryFields = fetchFormMandatoryFields(formJson, data.formState);
      const keys = Object.keys(mandatoryFields);
      let errorValues: any = {};
      const values: any = formState.values;
      keys.forEach((key: string) => {
        if ((key === name && !value) || (key !== name && !values[key])) errorValues[key] = true;
      })
      setFormState(prev => ({
        ...prev,
        values: {
          ...prev.values,
          ...newValues
        },
        errors: errorValues,
        touched: errorValues
      }));
      setOnChangeTouched(true);
    }
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
            : savedState && isExpanded && <Check className="w-6 h-6 text-green-500" />}

          <button
            onClick={() => onDelete(question.id)}
            className="p-1 text-gray-400 hover:text-red-500 rounded-md"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIsExpanded(!isExpanded)
              resetSavedStaus()
            }}
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
          {formJson && <FormBuilder
            formState={formState}
            id={question.id}
            handleFieldChange={handleFieldChange}
            formJson={formJson}
          />}
        </div>
      </div>
    </div>
  );
}