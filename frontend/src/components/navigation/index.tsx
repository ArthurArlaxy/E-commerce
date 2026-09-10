"use client"

import styles from "./styles.module.css"
import { BriefcaseBusiness, House, PackageSearch, ShoppingCart, UserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNavigation() {
    const path = usePathname()
    const pathName = path.split("/")

    return (
        <header>
            <nav className="main-nav">
                <div className={styles.navInner}>
                    <Link href="/"><House className={`${styles.icons} ${pathName[1] === "" ? "active-icon" : ''}`} /></Link>
                    <Link href="/admin"><BriefcaseBusiness className={`${styles.icons} ${pathName[1] === "admin" ? "active-icon" : ''}`} /></Link>
                </div>
                <div className={styles.navInner}>
                    <Link href="/cart"><ShoppingCart className={`${styles.icons} ${pathName[1] === "cart" ? "active-icon" : ''}`} /></Link>
                    <Link href="/orders"><PackageSearch className={`${styles.icons} ${pathName[1] === "order" ? "active-icon" : ''}`} /></Link>
                    <Link href="/profile"><UserRound className={`${styles.icons} ${pathName[1] === "profile" ? "active-icon" : ''}`} /></Link>
                </div>
            </nav>
        </header>
    )
}