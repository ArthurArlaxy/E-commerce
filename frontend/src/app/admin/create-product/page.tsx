import { getCategories } from "@/actions/categories"
import CreateProductForm from "@/components/forms/createProductForm"


export default async function Page() {
    const categories = await getCategories()
    return (
        <>
            <h2>Criação de Produto</h2>
            <CreateProductForm categories={categories} />
        </>
    )
}