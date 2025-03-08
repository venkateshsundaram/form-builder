export const QUESTION_TYPE_OPTIONS =  [
    { value: "text", label: "Text" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "boolean", label: "Boolean" },
    { value: "list", label: "List" },
    { value: "file", label: "File" },
];

export const NUMBER_TYPE_OPTIONS =  [
    { value: "default", label: "Default" },
    { value: "years", label: "Years" }
];

export const QUESTION_BUILDER_ID = "question-builder";

export const RESTRICTED_ATTRIBUTE_KEYS = ["validationCB", "type", "style", "noVariant", "layout", "className", 
"defaultValue", "hidden", "placeholder", "dependentAttributes"];