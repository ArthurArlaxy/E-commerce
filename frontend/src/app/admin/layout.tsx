"use client"

import Link from "next/link";
import styles from "./style.module.css"
import { usePathname } from "next/navigation";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()

  return (
    <>
      <h1 className="title">Administração</h1>
      <nav className={styles.navInner}>
        <Link className={`${styles.navAdminItem} ${pathname === "/admin" ? "active" : ''}`} href={"/admin"}>Dashboards</Link>
        <Link className={`${styles.navAdminItem} ${pathname === "/admin/create-product" ? "active" : ''}`} href={"/admin/create-product"}>Create Product</Link>
        <Link className={`${styles.navAdminItem} ${pathname === "/admin/update-product" ? "active" : ''}`} href={"/admin/update-product"}>Update Product</Link>
      </nav>
      <main className="pageContainer">
        {children}
      </main>
    </>
  )
}