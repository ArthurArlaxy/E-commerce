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
    placeholder?: string;
    categories: Category[];
}

export default function SelectInputLabel({ SelectName, label, categories }: SelectInputProps) {
    return (
        <div>
            <label htmlFor={SelectName} className={styles.label}>{label}</label>
            <select
                name={SelectName}
                id={SelectName}
                multiple
                size={3}
                required
                className={styles.select}>
                {categories && categories.length > 0
                    ? categories.map((category) => (
                        <option className={styles.option} key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))
                    : <option disabled>Erro ao acessar o servidor</option>}
            </select>
        </div>
    )
}