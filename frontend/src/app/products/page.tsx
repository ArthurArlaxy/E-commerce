import { getCategories } from "@/actions/categories";
import { getProducts, Product, searchProducts } from "@/actions/product";
import ProductCard from "@/components/Cards/ProductCard";
import { SearchProductForm } from "@/components/forms/searchForm";
import SearchInput from "@/components/inputs/searchInput";
import Pagination from "@/components/Pagination";



export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const search = await searchParams
  const products = await getProducts(search)
  const categories = await getCategories()

  if ("error" in products) {
    throw new Error("Falha ao tentar buscar os produtos")
  }


  return (
    <main>
      <form action={searchProducts.bind(null, { type: "products"})}> 
        <SearchInput inputName="name" placeholder="O que está procurando?" defaultValue={search?.name} />
        <SearchProductForm categories={categories} maxPrice={search?.maxPrice} minPrice={search?.minPrice} defaultCategories={search?.categories} includeOutOfStock={search?.includeOutOfStock}/>
        <section>
          <div className="card-container">
            {products.items.length ? products.items.map((product) => {
              return <ProductCard name={product.name} imageUrl={product.images[0].url} price={product.price.toString()} slug={product.slug} key={product.id} />
            }) : <p>Nenhum produto como esse disponível</p>}
          </div>
        </section>
        <Pagination
          currentPage={Number(search.page) || 1}
          totalPages={Math.ceil(products.total / (Number(search.limit) || 10))}
        />
      </form>
    </main>
  )
}

