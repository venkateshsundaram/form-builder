import { Textbox, Listbox, Numberbox, CheckBox, RadioBox } from "./FormFields";

interface IFormElementsProps {
    type: string;
}

export const FormElements = (props: IFormElementsProps) => {
    const { type } = props;

    const componentsMap: any = {
        text: Textbox,
        list: Listbox,
        checkbox: CheckBox,
        number: Numberbox,
        radio: RadioBox
    };

    const Component = componentsMap[type] || null;
    return <Component data={props} {...props} />
};
