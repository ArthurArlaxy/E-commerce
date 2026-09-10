import { getCategories } from "@/actions/categories";
import { getProducts, searchProducts } from "@/actions/product";
import CategoryCard from "@/components/Cards/CategoryCard";
import ProductCard from "@/components/Cards/ProductCard";
import SearchInput from "@/components/inputs/searchInput";
import Image from "next/image";

export default async function Page() {
  const products = await getProducts()
  const categories = await getCategories()

  if ("error" in products) {
    throw new Error("Falha ao tentar buscar o produtos")
  }
  if (!categories.length) {
    throw new Error("Falha ao tentar buscar o categorias")
  }

  return (
    <main>
      <div className="pageContainer">
        <form action={searchProducts.bind(null, { type: "products" })}>
          <SearchInput inputName="name" placeholder="O que está procurando?" />
        </form>
        <Image
          src="https://i.ibb.co/rKRy9W97/Banner-E-commerce.jpg"
          alt="Imagem da marca Tech E-commerce"
          width="1920"
          height="1080"
          priority
          style={{ width: '100%', height: 'auto' }}
        />
        <section>
          <h2 className="sectionTitle">Categorias</h2>
          <div className="category-card-container">
            {categories.map((category) => (
              <CategoryCard
                slug={category.slug}
                name={category.name}
                imageUrl={category.imageUrl}
                key={category.id}
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="sectionTitle">Ultimos lançamentos</h2>
          <div className="card-container">
            {products.items.map((product) => (
              <ProductCard
                name={product.name}
                imageUrl={product.images[0].url}
                price={String(product.price)}
                slug={product.slug}
                key={product.id}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}