import AuthForm from "@/components/authForm";
import styles from "./style.module.css"


export default function Page() {
    return (
        <div className="container">
            <header >
                <h1 className="authTitle">Tech E-Commerce</h1>
            </header>
            <main >
                <AuthForm
                    authType="Registrar"
                    action="criar a"
                    buttonAction="Criar"
                    secondAction="Entrar em uma"
                    buttonSecondAction="Entrar" />
            </main>
        </div>
    )   
}