import FormInputLabel from "@/components/inputs/formInputLabel";
import SelectInputLabel from "@/components/inputs/selectInput";
import Image from "next/image";
import styles from "./style.module.css"
import { getCategories } from "@/actions/categories";
import FormTextAreaLabel from "@/components/inputs/formTextAreaLabel";
import ImageUpload from "@/components/inputs/imageUpload";
import Button from "@/components/Button";

export default function Page() {
    return (
        <>
            <form className={styles.productForm} action="">
                <FormInputLabel type="text" inputName="name" label="Nome" placeholder="Nome do Produto" />
                <FormInputLabel type="number" inputName="price" label="Preço" placeholder="Preço do Produto" />
                <SelectInputLabel label="Categoria" SelectName="categories" getCategories={getCategories} />
                <FormInputLabel type="text" inputName="slug" label="Slug" placeholder="Slug do Produto" />
                <FormInputLabel type="number" inputName="stockQuantity" label="Quantidade em Estoque" placeholder="Quantidade do Produto em Estoque" />
                <FormTextAreaLabel textAreaName="description" label="Descrição" placeholder="Descrição do Produto" />
                <ImageUpload inputName="fotoProduto" label="Imagens do Produto" />
                <Button href="" text="Criar Produto"/>
            </form>
        </>
    );
}
