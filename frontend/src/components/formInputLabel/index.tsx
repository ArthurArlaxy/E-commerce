import styles from "./style.module.css"

interface FormInputProps {
    inputName: string;
    placeholder?: string;
}

export default function FormInput({ inputName, placeholder }: FormInputProps) {
    return (
        <>
            <label htmlFor={inputName} className={styles.label}>{inputName}</label>
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