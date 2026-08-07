import styles from "./style.module.css"

interface FormTextAreaProps {
    textAreaName: string;
    label: string;
    placeholder?: string;
}

export default function FormTextAreaLabel({ textAreaName, label, placeholder }: FormTextAreaProps) {
    return (
        <>
            <div>
                <label htmlFor={textAreaName} className={styles.label}>{label}</label>
                <textarea
                    name={textAreaName}
                    id={textAreaName}
                    placeholder={placeholder}
                    required
                    className={styles.textArea}
                    rows={10}
                />
            </div>
        </>
    )
}