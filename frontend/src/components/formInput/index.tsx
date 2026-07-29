import styles from "./style.module.css"

interface FormInputProps {
    inputName: string;
    placeholder?: string;
    value:string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({ inputName, placeholder, value, onChange }: FormInputProps) {
    return (
        <>
            <input
                type={inputName === "Senha" ? "password" : "text"}
                name={inputName}
                id={inputName}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                className={styles.input}
            />
        </>
    )
}