
import React, { useEffect, useState } from 'react';

import { isObject, omitObject } from "../utils/objectUtils";
import { fetchFormMandatoryFields } from "../utils/form";

import { RESTRICTED_ATTRIBUTE_KEYS } from "../constants/application";
import { FormElements } from "./FormElements"

interface IFormBuilderProps {
  formJson: any;
  formState: any;
  id: string;
  handleFieldChange: Function;
}

interface stateProps {
  values: any;
  touched: any;
  errors: any;
}

export const FormBuilder = (props: IFormBuilderProps) => {
  const { formJson = {}, formState, id = "" } = props;
  const [state, setFormState] = useState<stateProps>(formState || { values: {}, touched: {}, errors: {} });
  const [stateFormJson, setFormJson] = useState(formJson);
  const { touched }: stateProps = state;

  useEffect(() => {
    if (formJson) {
      setFormJson(formJson);
    }
  }, [formJson]);

  useEffect(() => {
    const mandatoryFields = fetchFormMandatoryFields(stateFormJson, formState || state);
    setFormState({ ...formState, mandatoryFields });
  }, [formState]);


  const showFormAttributes = (attributes: Array<any>, params: any= {}): JSX.Element[] | null => {
    return attributes.map((fieldItem: any, fieldItemIndex: number) => {
      let dependentAttributeItem = null;
      const fieldName = fieldItem?.name;
      let value = state.values ? state.values[fieldName as keyof typeof state.values] : "";

      if (!value && !(touched && touched[fieldName])) {
        value = fieldItem.defaultValue
      }

      if (Array.isArray(fieldItem.dependentAttributes)) {
        dependentAttributeItem = fieldItem.dependentAttributes.find((dependentAttribute: any) => {
          if (Array.isArray(fieldItem.options)) {
            return fieldItem.options.some((optionItem: any) => optionItem?.value === value) && dependentAttribute?.name === value
          } else if (isObject(fieldItem.options)) {
            return dependentAttribute?.name === value
          }
        })
      }

      const fieldError = state.errors[fieldName as keyof typeof state.errors];
      const error = (state.touched[fieldName as keyof typeof state.touched] && !value) || fieldError;

      let fieldParams: any = {
        value,
      };

      if (fieldItem.required || fieldItem.hasOwnProperty("validationCB")) {
        fieldParams = {
          ...fieldParams,
          "aria-invalid": error,
          error: error ? "Field Required" : "",
          variant: !fieldItem.noVariant && error ? "error" : ""
        }
      }

      const attrKey = params.hasOwnProperty("index") ? `attribute_${params.index}_${fieldItemIndex}`: `attribute_${fieldItemIndex}`;
      const dependentAttributeKey = params.hasOwnProperty("index") ? `dependentantAttribute_${params.index}_${fieldItemIndex}`: `dependentantAttribute_${fieldItemIndex}`;
      const fieldAttrParams = { index: params.hasOwnProperty("index") ? `${params.index}_${fieldItemIndex}`: fieldItemIndex };

      if (fieldItem.attributes) {
        return fieldItem.layout ==="horizontal"? <div key={attrKey}>{showFormAttributes(fieldItem.attributes, fieldAttrParams)}</div>: showFormAttributes(fieldItem.attributes, fieldAttrParams);
      } else if (!fieldItem.hidden) {
        return (
          <React.Fragment key={attrKey}>
            <FormElements
              {...props}
              {...fieldItem}
              {...fieldParams}
              id={attrKey}
              fieldProps={parseFieldProps(fieldItem)}
              handleChange={handleFieldChange}
            />
            {dependentAttributeItem?.layout ==="horizontal" ? <div className="layout-horizontal" key={dependentAttributeKey}>{showFormAttributes(dependentAttributeItem.attributes, fieldAttrParams)}</div> : dependentAttributeItem && showFormAttributes(dependentAttributeItem.attributes, fieldAttrParams)}
          </React.Fragment>
        );
      }
      return null;
    }).filter((element): element is JSX.Element => element !== null);
  }

  const updateFormState = (state: any, params: any) => {
    const { name, value, fieldValidItem, errorMessage } = params;

    return {
      touched: {
        ...state.touched,
        [name]: true,
      },
      values: {
        ...state.values,
        [name]: value,
      },
      errors: fieldValidItem && !fieldValidItem.valid ? {
        ...state.errors,
        [name]: fieldValidItem.message
      } : { ...state.errors, [name]: errorMessage || "" },
    }
  }

  const handleFieldChange = (value: string, name: string, data: any) => {
    const fieldValidItem = data.validationCB && data.validationCB({ ...data, name, value });

    setFormState((prev) => {
      return updateFormState(prev, {
        name,
        value,
        fieldValidItem,
        errorMessage: data.errorMessage
      })
    });

    if (props.handleFieldChange) {
      props.handleFieldChange(value, name,
        {
          ...data,
          formState: updateFormState(state, {
            name,
            value,
            fieldValidItem,
            errorMessage: data.errorMessage
          })
        }
      );
    }
  }

  const parseFieldProps = (fieldItem: any) => {
    return omitObject(fieldItem, RESTRICTED_ATTRIBUTE_KEYS)
  }

  const formResolver = (formItem: any, params: any = {}) => {
    const formAttributes = formItem.attributes

    if (formAttributes.length > 0) {
      return (
        <form
          className="form-resolver__wrapper__section__overview">
          {showFormAttributes(formAttributes, params)}
        </form>
      );
    }
    return null;
  }

  return <div className="form-resolver custom-form-resolver">{formResolver(stateFormJson, { index: id })}</div>;
};
