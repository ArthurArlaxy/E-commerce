import styles from "./style.module.css"

interface FormInputProps {
    type: string
    inputName: string;
    label: string;
    placeholder?: string;
    value?: string;
    required?: boolean;
    checked?: boolean;
    step?: string;
}

export default function FormInputLabel({ inputName, label, placeholder, value, type, required=true, checked=false, step}: FormInputProps) {
    return (
        <>
            <div className={styles.inputContainer}>
                <label htmlFor={inputName} className={styles.label}>{label}</label>
                <input
                    type={type}
                    step={step}
                    name={inputName}
                    id={inputName}
                    placeholder={placeholder}
                    required={required}
                    defaultChecked={checked}
                    className={styles.input}
                    defaultValue={value}
                />
            </div>
        </>
    )
}