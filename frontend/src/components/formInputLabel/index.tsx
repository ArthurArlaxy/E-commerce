import styles from "./style.module.css"

interface FormInputProps {
    type: string
    inputName: string;
    label: string;
    placeholder?: string;
}

export default function FormInput({ inputName, label, placeholder }: FormInputProps) {
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
            />
        </>
    )
}