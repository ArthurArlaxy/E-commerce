import { getCategories } from "@/actions/categories";
import CategoryUpdateCard from "@/components/Cards/CategoryUpdateCard";

export default async function Page() {
    const categories = await getCategories()
    console.log(categories)

    if ("error" in categories) {
        throw new Error("Falha ao tentar buscar os produtos")
    }


    return (
        <main className="pageContainer">
            <h2>Buscar Categorias</h2>
            <section>
                <div className="card-container">
                    {categories.length ? categories.map((category) => {
                        return <CategoryUpdateCard  name={category.name} id={category.id} imageUrl={category.imageUrl} key={category.id}/>
                    }) : <p>Nenhuma categoria disponível</p>}
                </div>
            </section>
        </main>
    )
}

