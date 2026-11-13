import { getCategories } from "@/actions/categories";
import { getProducts, searchProducts } from "@/actions/product";
import CategoryCard from "@/components/Cards/CategoryCard";
import ProductCard from "@/components/Cards/ProductCard";
import SearchInput from "@/components/inputs/searchInput";
import { imageSrc } from "@/utils/format";
import Image from "next/image";

export default async function Page() {
  const products = await getProducts()
  const categories = await getCategories()

  if ("error" in products) {
    console.log("Falha ao tentar buscar o produtos")
  }

  if (!categories.length) {
    console.log("Falha ao tentar buscar o categorias")
  }

  console.log(imageSrc(categories[0].imageUrl))

  return (
    <main>
      <div className="pageContainer">
        <form action={searchProducts.bind(null, { type: "products" })}>
          <SearchInput inputName="name" placeholder="O que está procurando?" />
        </form>
        <Image
          src="https://i.ibb.co/gLqQt1mD/banner-tech-ecommerce.png"
          alt="Imagem da marca Tech E-commerce"
          width={1321}
          height={350}
          sizes="(max-width: 1400px) 100vw, 1400px"
          priority
          className="main-banner"
        />
        <section>
          <h2 className="sectionTitle">Categorias</h2>
          {!categories.length ? <p>Nenhuma cartegoria disponível</p> : <div className="category-card-container">
            {categories.map((category) => (
              <CategoryCard
                slug={category.slug}
                name={category.name}
                imageUrl={category.imageUrl}
                key={category.id}
              />
            ))}
          </div>}
        </section>
        <section>
          <h2 className="sectionTitle">Ultimos lançamentos</h2>
          {"error" in products ? <p>Nenhum produto disponível</p> : <div className="card-container">
            {products.items.map((product) => (
              <ProductCard
                name={product.name}
                imageUrl={product.images[0].url}
                price={String(product.price)}
                slug={product.slug}
                key={product.id}
              />
            ))}
          </div>}
        </section>
      </div>
    </main>
  );
}