"use client"

import styles from "./style.module.css"

export interface Category {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
}

interface SelectInputProps {
    SelectName: string;
    label: string;
    categories: Category[] | [];
    originalValuesId?: string[];
    required?: boolean;
    hidden?:boolean;
}

export default function SelectInputLabel({ SelectName, label, categories, originalValuesId, required, hidden }: SelectInputProps) {

    return (
        <div className={hidden? "hidden": ""}>
            <label htmlFor={SelectName} className={styles.label}>{label}</label>
            <select
                name={SelectName}
                id={SelectName}
                multiple
                size={3}
                required={required}
                defaultValue={originalValuesId}
                className={styles.select}
            >
                {categories && categories.length > 0
                    ? categories.map((category) => (
                        <option
                            className={styles.option}
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))
                    : <option disabled>Erro ao acessar o servidor</option>}
            </select>
        </div>
    )
}