"use client"

import Button from "@/components/Button"
import FormInputLabel from "@/components/inputs/formInputLabel"
import SelectInputLabel, { Category } from "@/components/inputs/selectInput"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface SearchProductProps {
    categories: Category[] | [] ;
    maxPrice?: string;
    minPrice?: string;
    includeOutOfStock?: string | string[];
    hiddenCategory?: boolean;
    defaultCategories?: string;
}


export function SearchProductForm({ categories, maxPrice, minPrice, includeOutOfStock, hiddenCategory, defaultCategories}: SearchProductProps) {
    const [form, setForm] = useState(false)

    return (
        <fieldset className="search-form">
            <button type="button" className={form ? "hidden" : "arrow-btn"} onClick={() => setForm(!form)}><ChevronDown /></button>
            <div className={form ? "search-form-modal" : "hidden"}>
                <div className="search-form-container">
                    <FormInputLabel inputName="maxPrice" label="Preço Max." required={false} type="number" placeholder="Valor max." value={maxPrice} />
                    <FormInputLabel inputName="minPrice" label="Preço Min." type="number" placeholder="Valor Min." required={false} value={minPrice} />
                    <FormInputLabel inputName="includeOutOfStock" label="Incluir esgotados" type="checkBox" required={false} checked={Boolean(includeOutOfStock)}/>
                </div>
                <SelectInputLabel SelectName="categories" label="Categoria" categories={categories} required={false} originalValuesId={defaultCategories?.split(",")} hidden={hiddenCategory} />
                <Button text="Filtrar" />
            </div>
            <button type="button" className={form ? "arrow-btn" : "hidden"} onClick={() => setForm(!form)}><ChevronUp /></button>
        </fieldset>
    )
}