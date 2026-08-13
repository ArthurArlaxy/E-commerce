"use client"

import FormInputLabel from "@/components/inputs/formInputLabel";
import SelectInputLabel, { Category } from "@/components/inputs/selectInput";
import styles from "./style.module.css"
import FormTextAreaLabel from "@/components/inputs/formTextAreaLabel";
import ImageUpload from "@/components/inputs/imageUpload";
import Button from "@/components/Button";
import { ProductById, ProductState, updateCreateForm } from "@/actions/product";
import { useActionState } from "react";
import ImageUploadMultiple from "@/components/inputs/imageUpload";

const initialState: ProductState = {};

interface UpdateProductFormProps {
    categories: Category[]
    product: ProductById;
}

export default function UpdateProductForm({ categories, product }: UpdateProductFormProps) {
    const originalCategories: string[] = []
    product.productCategories.map((category) => originalCategories.push(category.category.id))
    if (!product.images) throw new Error("Falha ao tentar buscar as imagens do produto para a atualização!")

    const [state, formActionHandler, isPending] = useActionState(updateCreateForm, initialState)
    return (
        <>
            <form className={styles.productForm} action={formActionHandler}>
                <input type="hidden" name="id" value={product.id} />
                <FormInputLabel type="text" inputName="name" label="Nome" placeholder="Nome do Produto" value={product.name} />
                <FormInputLabel type="number" inputName="price" label="Preço" placeholder="Preço do Produto" value={product.price.toString()} />
                <SelectInputLabel label="Categoria" SelectName="categories" categories={categories} originalValuesId={originalCategories} />
                <FormInputLabel type="text" inputName="slug" label="Slug" placeholder="Slug do Produto" value={product.slug} />
                <FormInputLabel type="number" inputName="stock" label="Quantidade em Estoque" placeholder="Quantidade do Produto em Estoque" value={product.stock.toString()} />
                <FormTextAreaLabel textAreaName="description" label="Descrição" placeholder="Descrição do Produto" value={product.description} />
                <ImageUploadMultiple
                    imagesImported={product.images.map((img) => ({
                        id: img.id,
                        url: img.url,
                        order: img.order,
                        isCover: img.isCover,
                    }))}
                />
                {state?.error && <p className={styles.errorText}>{state.error}</p>}
                <Button text={isPending ? "...Aguarde" : "Atualizar Produto"} />
            </form>
        </>
    );
}
