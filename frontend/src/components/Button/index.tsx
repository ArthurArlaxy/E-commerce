import Link from "next/link"
import styles from "./style.module.css"

export default function Button({text, href}: {text:string, href?:string}){
    if(href){
        return <Link className={styles.btn} href={href}>{text}</Link>
    }
    return <button className={styles.btn}>{text}</button>
}