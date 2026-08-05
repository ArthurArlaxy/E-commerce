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
      <header className={styles.adminBar}>
        <h1 className="title">Administração</h1>
        <nav>
            <div className="nav-inner">
              <Link className={`nav-admin-item ${pathname === "/admin" ? "active" : ''}`} href={"/admin"}>Dashboards</Link>
              <Link className={`nav-admin-item ${pathname === "/admin/create-product" ? "active" : ''}`} href={"/admin/create-product"}>Create Product</Link>
              <Link className={`nav-admin-item ${pathname === "/admin/update-product" ? "active" : ''}`} href={"/admin/update-product"}>Update Product</Link>
            </div>
        </nav>
      </header >
      <main>
        {children}
      </main>
      <footer></footer>
    </>
  )
}