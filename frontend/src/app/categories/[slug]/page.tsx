import { getCategoryBySlug } from "@/actions/categories"
import { getProducts, searchProducts } from "@/actions/product"
import ProductCard from "@/components/Cards/ProductCard"
import { SearchProductForm } from "@/components/forms/searchForm"
import SearchInput from "@/components/inputs/searchInput"
import Pagination from "@/components/Pagination"
import { SlowBuffer } from "buffer"
import Image from "next/image"


export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)

    const search = await searchParams

    const products = await getProducts({ ...search, categories: category?.id })

    if (!category) {
        throw new Error("Erro ao procurar categoria")
    }

    if ("error" in products) {
        throw new Error("Erro ao procurar produtos")
    }

    return (
        <main className="pageContainer">
            <Image className="image-category-container"
                src={category?.imageUrl}
                alt={`Imagem da categoria ${category?.name}`}
                width="1920"
                height="1080"
                priority
            />
            <h1 className="sectionTitle">{category?.name}</h1>
            <form action={searchProducts.bind(null, { type: 'categories', slug: slug })}>
                <SearchInput inputName="name" placeholder="O que está procurando?" defaultValue={search.name} />
                <SearchProductForm maxPrice={search.maxPrice} minPrice={search.minPrice} includeOutOfStock={search.includeOutOfStock} hiddenCategory={true} categories={[]} />
            </form>
            <section>
                <div className="card-container">
                    {products.items.length ? products.items.map((product) => {
                        return <ProductCard name={product.name} imageUrl={product.images[0].url} price={product.price.toString()} slug={product.slug} key={product.id} />
                    }) : <p>Nenhum produto como esse disponível</p>}
                </div>
            </section>
            <Pagination category={slug} nextRoute="categories" currentPage={Number(search.page) || 1} totalPages={Math.ceil(products.total / Number(search.limit)) || 1} />
            <a href="/">Sair da categoria: {category?.name}</a>
        </main>
    )
}