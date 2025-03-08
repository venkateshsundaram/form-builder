export const QUESTION_TYPE_OPTIONS =  [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "select", label: "Select" }
];

export const NUMBER_TYPE_OPTIONS =  [
    { value: "default", label: "Default" },
    { value: "years", label: "Years" }
];

export const QUESTION_BUILDER_ID = "question-builder";

export const RESTRICTED_ATTRIBUTE_KEYS = ["validationCB", "type", "style", "noVariant", "layout", "className", 
"defaultValue", "hidden", "placeholder", "dependentAttributes"];

export const DEFAULT_SELECT_OPTIONS = [{
    layout: "horizontal",
    attributes: [{
        name: "selectOption1",
        label: "Option",
        type: "text",
        required: true
    }, {
        name: "deleteselectOption1",
        label: "Remove",
        type: "button",
        color: "red"
    }]
}];

export const DEFAULT_FORM_VALUES = { values: {}, touched: {}, errors: {} };