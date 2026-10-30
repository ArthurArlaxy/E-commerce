"use client"

import FormInputLabel from "@/components/inputs/formInputLabel";
import styles from "./style.module.css"
import ImageUpload from "@/components/inputs/imageUpload";
import Button from "@/components/Button";
import { useActionState } from "react";
import { categoryCreateForm, CategoryState } from "@/actions/categories";

const initialState: CategoryState = {};

export default function CreateCategoryForm() {
    const [state, formActionHandler, isPending] = useActionState(categoryCreateForm, initialState)
    return (
        <>
            <form className={styles.productForm} action={formActionHandler}>
                <FormInputLabel type="text" inputName="name" label="Nome" placeholder="Nome da Categoria" />
                <FormInputLabel type="text" inputName="slug" label="Slug" placeholder="Slug da Categoria" required={false} />
                <ImageUpload />
                {state?.error && <p className={styles.errorText}>{state.error}</p>}
                <Button text={isPending ? "...Aguarde" : "Criar Categoria"} />
            </form>
        </>
    );
}
