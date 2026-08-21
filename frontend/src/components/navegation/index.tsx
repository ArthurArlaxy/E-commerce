"use client"

import { BriefcaseBusiness, House, PackageSearch, ShoppingCart, UserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNavegation() {
    const path = usePathname()
    const pathName = path.split("/")

    return (
        <header >
            <nav >
                <div className="nav-inner">
                    <Link href="/"><House className={`icons ${pathName[1] === "" ? "active-icon" : ''}`} /></Link>
                    <Link href="/admin"><BriefcaseBusiness className={`icons ${pathName[1] === "admin" ? "active-icon" : ''}`} /></Link>
                </div>
                <div className="nav-inner">
                    <Link href="/cart"><ShoppingCart className={`icons ${pathName[1] === "cart" ? "active-icon" : ''}`} /></Link>
                    <Link href="/orders"><PackageSearch className={`icons ${pathName[1] === "order" ? "active-icon" : ''}`} /></Link>
                    <Link href="/profile"><UserRound className={`icons ${pathName[1] === "profile" ? "active-icon" : ''}`} /></Link>
                </div>
            </nav>
        </header>
    )
}

