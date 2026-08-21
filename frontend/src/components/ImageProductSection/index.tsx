"use client"

import { useState } from "react"
import { Product } from "@/actions/product"
import Image from "next/image"

export function ImageProductSection({ product }: { product: Product }) {
    const [selectedImage, setSelectedImage] = useState(product.images[0].url)
    let i: number = 1

    return (
        <div className="product-images-container">
            <div className="product-image-wrapper desktop-only">
                <Image
                    alt="Imagem principal do produto"
                    src={selectedImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="image-product"
                    priority
                />
            </div>
            <div className="product-side-images-container desktop-only">
                {product.images.map((image) => (
                    <div className="product-image-wrapper" key={image.id}>
                        <Image
                            alt={`Imagem ${image.order} do produto`}
                            src={image.url}
                            fill
                            sizes="100px"
                            className="image-product"
                            onClick={() => setSelectedImage(image.url)}
                        />
                    </div>
                ))}
            </div>
            <div className="mobile-carousel mobile-only">
                {product.images.map((image) => (
                    <div className="mobile-carousel-item" key={image.id}>
                        <Image
                            alt={`Imagem ${image.order} do produto`}
                            src={image.url}
                            fill
                            sizes="100vw"
                            className="image-product"
                            priority={image.id === product.images[0].id}
                        />
                        <p className="image-counter">{`${i++}/${product.images.length}`}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}