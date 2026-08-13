import { getCategories } from "@/actions/categories";
import { getProductById} from "@/actions/product";
import UpdateProductForm from "@/components/forms/updateProductForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params
    const categories = await getCategories()
    const product = await getProductById(id)

    if ("error" in product) {
        throw new Error("Falha ao tentar buscar o produto para a atualização!")
    }
    

    return (
        <UpdateProductForm
            categories={categories}
            product={product}
        />
    )
}