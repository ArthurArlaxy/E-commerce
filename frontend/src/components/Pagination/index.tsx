"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    nextRoute?: "products" | "categories"
    category?: string
}

export default function Pagination({
    currentPage,
    totalPages,
    nextRoute="products",
    category
}: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    function changePage(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));

        if(nextRoute === "categories"){
            router.push(`/categories/${category}?${params.toString()}`);
        }else{
            router.push(`/products?${params.toString()}`)
        }
    }

    return (
        <section className="page-section-container">
            <button
                type="button"
                className="arrow-btn"
                disabled={currentPage <= 1}
                onClick={() => changePage(currentPage - 1)}
                aria-label="Página anterior"
            >
                <ChevronLeft />
            </button>

            <span>
                {currentPage} / {totalPages}
            </span>

            <button
                type="button"
                className="arrow-btn"
                disabled={currentPage >= totalPages}
                onClick={() => changePage(currentPage + 1)}
                aria-label="Próxima página"
            >
                <ChevronRight />
            </button>
        </section>
    );
}