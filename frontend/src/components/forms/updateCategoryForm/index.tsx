"use client"

import FormInputLabel from "@/components/inputs/formInputLabel";
import Button from "@/components/Button";
import { useActionState } from "react";
import ImageUploadMultiple from "@/components/inputs/imageUpload";
import { categoryUpdateForm, Category, CategoryState, DeleteCategory } from "@/actions/categories";
import styles from "./style.module.css"
import DeleteWithConfirm from "@/components/DeleteWithConfirm";

const initialState: CategoryState = {};

export default function UpdateCategoryForm({ category }: { category: Category }) {
    if (!category.imageUrl) throw new Error("Falha ao tentar buscar as imagens do produto para a atualização!")

    const [state, formActionHandler, isPending] = useActionState(categoryUpdateForm, initialState)

    return (
        <>
            <form className={styles.productForm} action={formActionHandler}>
                <input type="hidden" name="id" value={category.id} />
                <FormInputLabel type="text" inputName="name" label="Nome" placeholder="Nome da Categoria" value={category.name} />
                <FormInputLabel type="text" inputName="slug" label="Slug" placeholder="Slug do Produto" value={category.slug} />
                <ImageUploadMultiple imagesImported={[{ id: category.id, url: category.imageUrl, order: 0, isCover: true }]} />
                {state?.error && <p className={styles.errorText}>{state.error}</p>}
                <Button text={isPending ? "...Aguarde" : "Atualizar Categoria"} />
            </form>
            <div className={styles.deleteForm}>
                <DeleteWithConfirm
                    action={DeleteCategory}
                    id={category.id}
                    itemName={category.name}
                    label="Excluir categoria"
                />
            </div>
        </>
    );
}
