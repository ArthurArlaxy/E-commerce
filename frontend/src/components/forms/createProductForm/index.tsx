"use client"

import FormInputLabel from "@/components/inputs/formInputLabel";
import SelectInputLabel, { Category } from "@/components/inputs/selectInput";
import styles from "./style.module.css"
import FormTextAreaLabel from "@/components/inputs/formTextAreaLabel";
import ImageUpload from "@/components/inputs/imageUpload";
import Button from "@/components/Button";
import { productCreateForm, ProductState } from "@/actions/product";
import { useActionState } from "react";

const initialState: ProductState = {};

export default function CreateProductForm({categories}: {categories: Category[]}) {
    const [state, formActionHandler, isPending] = useActionState(productCreateForm, initialState)
    return (
        <>
            <form className={styles.productForm} action={formActionHandler}>
                <FormInputLabel type="text" inputName="name" label="Nome" placeholder="Nome do Produto" />
                <FormInputLabel type="number" inputName="price" label="Preço" placeholder="Preço do Produto" />
                <SelectInputLabel label="Categoria" SelectName="categories" categories={categories} />
                <FormInputLabel type="text" inputName="slug" label="Slug" placeholder="Slug do Produto" />
                <FormInputLabel type="number" inputName="stock" label="Quantidade em Estoque" placeholder="Quantidade do Produto em Estoque" />
                <FormTextAreaLabel textAreaName="description" label="Descrição" placeholder="Descrição do Produto" />
                <ImageUpload />
                {state?.error && <p className={styles.errorText}>{state.error}</p>}
                <Button text={isPending ? "...Aguarde" : "Criar Produto"} />
            </form>
        </>
    );
}
