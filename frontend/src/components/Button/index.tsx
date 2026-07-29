import styles from "./style.module.css"

export default function Button({text}: {text:string}){
    return (
        <button className={styles.btn}>{text}</button>
    )
}