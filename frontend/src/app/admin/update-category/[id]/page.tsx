import { getCategoryById } from "@/actions/categories";
import UpdateCategoryForm from "@/components/forms/updateCategoryForm";


interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params
    const category = await getCategoryById(id)

    if (!category) {
        throw new Error("Falha ao tentar buscar o produto para a atualização!")
    }


    return (
        <>
            <h2>Atualização de Categorias</h2>
            <UpdateCategoryForm category={category} />
        </>
    )
}