import { QUESTION_TYPE_OPTIONS, NUMBER_TYPE_OPTIONS } from "./application";

export const QUESTION_FORMS_JSON: any =  {
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