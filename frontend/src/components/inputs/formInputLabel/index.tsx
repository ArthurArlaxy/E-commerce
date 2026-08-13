import styles from "./style.module.css"

interface FormInputProps {
    type: string
    inputName: string;
    label: string;
    placeholder?: string;
    value?: string;
}

export default function FormInput({ inputName, label, placeholder, value }: FormInputProps) {
    return (
        <>
            <label htmlFor={inputName} className={styles.label}>{label}</label>
            <input
                type="text"
                name={inputName}
                id={inputName}
                placeholder={placeholder}
                required
                className={styles.input}
                defaultValue={value}
            />
        </>
    )
}