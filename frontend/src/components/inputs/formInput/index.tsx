import styles from "./style.module.css"

interface FormInputProps {
    inputName: string;

    placeholder?: string;
}

export default function FormInput({ inputName, placeholder,}: FormInputProps) {
    return (
        <>
            <input
                type={inputName === "senha" ? "password" : "text"}
                name={inputName}
                id={inputName}
                placeholder={placeholder}
                className={styles.input}
            />
        </>
    )
}