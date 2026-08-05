import { getCategories } from "@/actions/categories"
import CreateProductForm from "@/components/createProductForm"


export default async function Page() {
    const categories = await getCategories()
    return <CreateProductForm categories={categories} />
}