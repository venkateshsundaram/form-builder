import { QUESTION_TYPE_OPTIONS, NUMBER_TYPE_OPTIONS, DEFAULT_SELECT_OPTIONS } from "./application";

export const fetchQuestionFormJson = (params: any = {}) => {
    const { selectedOptions = DEFAULT_SELECT_OPTIONS } = params;
    
    return {
        attributes: [{
            name: "title",
            label: "Question title",
            type: "text",
            required: true
        }, {
            attributes: [{
                name: "questionType",
                label: "Question type",
                type: "list",
                required: true,
                options: QUESTION_TYPE_OPTIONS,
                dependentAttributes: [{
                    name: "text",
                    attributes: [{
                        name: "isParagraph",
                        label: "Is Paragraph",
                        type: "checkbox"
                    }]
                }, {
                    name: "number",
                    layout: "horizontal",
                    attributes: [{
                        name: "numberType",
                        label: "Number Type",
                        options: NUMBER_TYPE_OPTIONS,
                        required: true,
                        type: "list"
                    }, {
                        name: "min",
                        label: "Min",
                        type: "text"
                    }, {
                        name: "max",
                        label: "Max",
                        type: "text"
                    }]
                }, {
                    name: "select",
                    attributes: [...selectedOptions, {
                        name: "addOption",
                        label: "Add option",
                        type: "button"
                    }]
                }]
            }, {
                name: "isRequired",
                label: "Required",
                type: "checkbox"
            }, {
                name: "isHidden",
                label: "Hidden",
                type: "checkbox"
            }]
        }, {
            name: "helpText",
            label: "Helper text",
            type: "text"
        }]
    };
};
