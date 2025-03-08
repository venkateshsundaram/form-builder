import { isObject } from "./objectUtils";

export function fetchFormMandatoryFields(formJson: any, formParams: any = {}) {
    const fields: any = {};
    const params = { ...formParams, fields };

    if (formJson?.attributes) {
        appendAttributeMandatoryFields(formJson.attributes, params)
    }

    return params.fields;
}

function appendAttributeMandatoryFields(attributes: any, params: any = {}) {
    const { values = {} } = params;

    if (Array.isArray(attributes)) {
        attributes.forEach((attribute: any) => {
            if (Array.isArray(attribute.dependentAttributes)) {
                const value = values[attribute.name] || attribute.defaultValue;
                const dependentAttributeItem = attribute.dependentAttributes.find((dependentAttribute: any) => {
                    if (Array.isArray(attribute.options)) {
                        return attribute.options.some((optionItem: any) => optionItem?.value === value) && dependentAttribute?.name === value
                    } else if (isObject(attribute.options)) {
                        return dependentAttribute?.name === value
                    }
                })
                if (dependentAttributeItem?.attributes) {
                    appendAttributeMandatoryFields(dependentAttributeItem.attributes, params)
                }
            } else if (Array.isArray(attribute.attributes)) {
                appendAttributeMandatoryFields(attribute.attributes, params)
            }

            if (attribute.required && !attribute.hidden) {
                params.fields[attribute.name] = true
            }
        })
    }
}

export function fetchFormBuilderJson(questions: Array<any>) {
    let formJson: any = { attributes: [] };
    questions.forEach((question: any, questionIndex: number) => {

        switch (question.questionType) {
            case "text":
                formJson.attributes.push({
                    name: `question${questionIndex}`,
                    label: question.label,
                    type: question.isParagraph ? "textarea": "text",
                    required: question.isRequired,
                    hidden: question.isHidden,
                    paragraph: question.isParagraph
                })
                break;
            case "number":
                formJson.attributes.push({
                    name: `question${questionIndex}`,
                    label: question.label,
                    type: "number",
                    min: question.min,
                    max: question.max,
                    required: question.isRequired,
                    hidden: question.isHidden,
                    validationCB: function(field: any) {
                        const value = field.value;
                        if (!(value>=field.min && value<=field.max)) {
                            return {
                                valid: false,
                                message: `Value should between ${field.min} and ${field.max}`
                            }
                        }
                    }
                })
                break;
            case "select":
                const questionKeys = Object.keys(question);
                const optionKeys = questionKeys.filter((key: string) => key.startsWith("selectOption") && question[key])
                optionKeys.sort();
                formJson.attributes.push({
                    name: `question${questionIndex}`,
                    label: question.label,
                    type: "list",
                    required: question.isRequired,
                    hidden: question.isHidden,
                    options: optionKeys.map((key: string) => ({
                        value: question[key],
                        label: question[key],
                    }))
                })
                break;
            default:
                break;
        }
    });

    return formJson;
}

export function disbleFormAttr(options: Array<any>) {
    return options.map((option: any, optionIndex: number, all: Array<any>) => {
        if (optionIndex === 0) {
            return {
                ...option,
                attributes: option.attributes.map((attr: any) => {
                    if (attr.label === "Remove") {
                        return { ...attr, disabled: all.length ===1 }
                    }
                    return attr;
                })
            }
        }
        return option;
    });
}