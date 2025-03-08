import { useState } from "react";

interface IFormFieldsProps {
    data: any;
    handleChange: Function;
    name: string;
    numRows: number;
    "aria-describedby"?: string;
    ariaLabelledBy?: string;
    "aria-label"?: string;
    id?: string;
    key?: string;
    error?: string;
}

const Textbox = ({ data, handleChange, name, 'aria-describedby': ariaDescribedBy, id = "", key = "", error = "" }: IFormFieldsProps) => {
    const { className = "", required = false, style = {}, label = "", autoComplete = "on", placeholder = "", fieldProps = {} } = data;

    return (
        <div className="relative mt-2 mb-2 mr-2 w-full">
            <div className="relative">
                <input
                    type="text"
                    aria-describedby={ariaDescribedBy}
                    id={id || key || name}
                    disabled={data?.disabled}
                    value={data?.value ?? ""}
                    style={style}
                    autoComplete={autoComplete}
                    onChange={(e: any) => handleChange(e.target.value, name, data)}
                    placeholder={placeholder}
                    {...fieldProps}
                    className={`${className} border-1 peer block w-full appearance-none rounded-lg border border-${error ? "red" : "gray"}-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-${error ? "red" : "gray"}-900 focus:${error ? "border-red-600" : "border-blue-600"} focus:outline-none focus:ring-0`}
                />
                <label htmlFor={id || key || name} className={`absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-${error ? "red" : "gray"}-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-${error ? "red" : "blue"}-600`}>
                    {label} {required ? "*" : ""}
                </label>
            </div>
            {error && <p id={id || key || name} className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

const Numberbox = ({ data, handleChange, name, 'aria-describedby': ariaDescribedBy, id = "", key = "", error = "" }: IFormFieldsProps) => {
    const { className = "", required = false, style = {}, label = "", autoComplete = "on", placeholder = "", fieldProps = {}, min ="", max ="" } = data;

    return (
        <div className="relative mt-2 mb-2 w-full">
            <div className="relative">
                <input
                    type="text"
                    aria-describedby={ariaDescribedBy}
                    id={id || key || name}
                    min={min}
                    max={max}
                    disabled={data?.disabled}
                    value={data?.value ?? ""}
                    style={style}
                    autoComplete={autoComplete}
                    onChange={(e: any) => {
                        if ((e.target.value === '' || /^\d*$/.test(e.target.value))
                        ) {
                            handleChange(e.target.value, name, data);
                        }
                    }}
                    placeholder={placeholder}
                    {...fieldProps}
                    className={`${className} border-1 peer block w-full appearance-none rounded-lg border border-${error ? "red" : "gray"}-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-${error ? "red" : "gray"}-900 focus:border-${error ? "red" : "blue"}-600 focus:outline-none focus:ring-0`}
                />
                <label htmlFor={id || key || name} className={`absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-${error ? "red" : "gray"}-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-${error ? "red" : "blue"}-600`}>
                    {label} {required ? "*" : ""}
                </label>
            </div>
            {error && <p id={id || key || name} className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

const CheckBox = ({ data, handleChange, name, 'aria-describedby': ariaDescribedBy, id = "", key = "", error = "" }: IFormFieldsProps) => {
    const { className = "", style = {}, label = "", fieldProps = {} } = data;

    return (
        <div className="flex items-center mb-4">
            <input
                type="checkbox"
                aria-describedby={ariaDescribedBy}
                id={id || key || name}
                disabled={data?.disabled}
                checked={data?.value ?? ""}
                style={style}
                onChange={(e: any) => handleChange(e.target.checked, name, data)}
                className={`${className} w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                {...fieldProps}
            />
            <label htmlFor={id || key || name} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>
        </div>
    );
}

const RadioBox = ({ data, handleChange, name, 'aria-describedby': ariaDescribedBy, id = "", key = "", error = "" }: IFormFieldsProps) => {
    const { className = "", style = {}, label = "", fieldProps = {} } = data;

    return (
        <div className="flex items-center mb-4">
            <input
                type="radio"
                aria-describedby={ariaDescribedBy}
                id={id || key || name}
                disabled={data?.disabled}
                checked={data?.value ?? ""}
                style={style}
                onChange={(e: any) => handleChange(e.target.checked, name, data)}
                className={`${className} w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`}
                {...fieldProps}
            />
            <label htmlFor={id || key || name} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>
        </div>
    );
}

const Listbox = ({ data, handleChange, name, 'aria-describedby': ariaDescribedBy, id = "", key = "", error = "" }: IFormFieldsProps) => {
    const [selected, setSelected] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const { className = "", required = false, style = {}, label = "", options = [], fieldProps = {} } = data;

    return (
        <div className="relative mt-2 mb-2 mb-2 mr-2 w-full">
            <div className="relative">
                <label
                    htmlFor={id || key || name}
                    className={`absolute left-3 top-2 text-${error ? "red" : "gray"}-500 transition-all ${isFocused || selected || data.value ? "text-xs -top-2.5 bg-white px-1" : "text-sm top-2"
                        }`}
                >
                    {label} {required ? "*" : ""}
                </label>

                <select
                    value={data?.value ?? ""}
                    style={style}
                    aria-describedby={ariaDescribedBy}
                    onChange={(e: any) => {
                        setSelected(e.target.value)
                        handleChange(e.target.value, name, data)
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(selected !== "")
                        setSelected("")
                    }}
                    id={id || key || name}
                    className={`${className} w-full px-4 pt-4 pb-2 bg-white border border-${error ? "red" : "gray"}-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-${error ? "red" : "blue"}-500 appearance-none`}
                    {...fieldProps}
                >
                    <option value="" disabled hidden></option>
                    {options.map((option: any) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    ▼
                </div>
            </div>
            {error && <p id={id || key || name} className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

export const Buttons = ({ data, handleChange, name, 'aria-describedby': ariaDescribedBy, id = "", key = "" }: IFormFieldsProps) => {
    const { className = "", style = {}, label = "", fieldProps = {}, color = "blue" } = data;

    return (
        <button 
            type="button"
            style={style}
            aria-describedby={ariaDescribedBy}
            id={id || key || name}
            {...fieldProps}
            onClick={(e: any) => {
                e.preventDefault();
                handleChange(e.target.checked, name, data);
            }}
            className={`${className} ${data.disabled? "opacity-50": ""} px-3 py-2 text-${color}-500 hover:text-${color}-700`}>
            {label}
        </button>
    );
}

const TextArea = ({ data, handleChange, name, 'aria-describedby': ariaDescribedBy, id = "", key = "", error = "" }: IFormFieldsProps) => {
    const { className = "", required = false, style = {}, label = "", autoComplete = "on", placeholder = "", fieldProps = {}, rows= 3 } = data;

    return (
        <div className="relative mt-2 mb-2 mr-2 w-full">
            <textarea
                rows={rows}
                aria-describedby={ariaDescribedBy}
                id={id || key || name}
                disabled={data?.disabled}
                value={data?.value ?? ""}
                style={style}
                autoComplete={autoComplete}
                required={required}
                onChange={(e: any) => handleChange(e.target.value, name, data)}
                placeholder={placeholder || label}
                {...fieldProps}
                className={`${className} border-1 peer block w-full appearance-none rounded-lg border border-${error ? "red" : "gray"}-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-${error ? "red" : "gray"}-900 focus:${error ? "border-red-600" : "border-blue-600"} focus:outline-none focus:ring-0`}
                />
            {error && <p id={id || key || name} className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}
export { Textbox, Listbox, Numberbox, CheckBox, RadioBox, TextArea };
