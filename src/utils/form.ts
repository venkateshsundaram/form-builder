import { isObject } from "./objectUtils";

export function fetchFormMandatoryFields(formJson: any, formParams: any = {}) {
    const fields: any = {};
    const params = { ...formParams, fields };

    if (formJson.attributes) {
        appendAttributeMandatoryFields(formJson.attributes, params)
    }

    return params.fields;
}

function appendAttributeMandatoryFields(attributes: any, params: any = {}) {
    const { values= {}} = params;

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
            } else if (Array.isArray(attribute.attributes)){
                appendAttributeMandatoryFields(attribute.attributes, params)
            }

            if (attribute.required && !attribute.hidden) {
                params.fields[attribute.name] = true
            }
        })
    }
}
