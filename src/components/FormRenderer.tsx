import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

import clsx from 'clsx';
import { FormBuilder } from './FormBuilder';
import { DEFAULT_FORM_VALUES } from "../constants/application"
import { fetchFormBuilderJson, fetchFormMandatoryFields } from "../utils/form";

const FormRenderer = ({ formId = "", savedQuestions }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [formState, setFormState] = useState(DEFAULT_FORM_VALUES);
    const [formJson, setFormJson] = useState<any>();

    useEffect(() => {
        const formJson = fetchFormBuilderJson(savedQuestions || []);
        setFormJson(formJson);
        setFormState(DEFAULT_FORM_VALUES);
        setIsExpanded(false);
    }, [savedQuestions]);

    const handleFieldChange = (value: any, name: string, data: any) => {
        setFormState(() => data.formState)
    }

    const isFormValid = (values: any): boolean => {
        const mandatoryFields = fetchFormMandatoryFields(formJson, formState);
        const keys = Object.keys(mandatoryFields);
        return keys.every((key: string) => values[key as keyof typeof values]);
    };
    
    const handleFormSubmit = () => {
        const values = formState.values;
        if (isFormValid(values)) {
            confirm(JSON.stringify(values))
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div
                className={clsx(
                    "bg-white rounded-lg border shadow-sm overflow-hidden transition-shadow",
                    "shadow-sm"
                )}
            >
                <div className="flex items-center justify-between p-3 bg-gray-200 border-b">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 truncate max-w-md">
                            Expand Form Preview
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setIsExpanded(!isExpanded)
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
                            id={formId}
                            handleFieldChange={handleFieldChange}
                            formJson={formJson}
                        />}
                    </div>
                    {savedQuestions.length > 0 ? <div className="sm:flex sm:justify-center">
                    <button onClick={handleFormSubmit} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button">Save</button>
                    </div> : <p className="sm:flex sm:justify-center text-gray-500">No form data available for preview.</p>}
                </div>
            </div>
        </div>
    );
};

export default FormRenderer;
