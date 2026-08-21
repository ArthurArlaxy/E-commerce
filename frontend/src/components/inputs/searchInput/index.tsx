import { Search } from "lucide-react";
import styles from "./style.module.css"

interface FormInputProps {
    inputName: string;
    placeholder?: string;
    defaultValue?: string | string[];
}

export default function SearchInput({ inputName, placeholder, defaultValue }: FormInputProps) {
    return (
        <>
            <div className="searchInput">
                <Search className="icon-search-input" />
                <input
                    type={inputName === "senha" ? "password" : "text"}
                    name={inputName}
                    id={inputName}
                    placeholder={placeholder}
                    className={styles.input}
                    defaultValue={defaultValue}
                />
            </div >
        </>
    )
}