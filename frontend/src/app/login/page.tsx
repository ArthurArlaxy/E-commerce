import AuthForm from "@/components/authForm";
import styles from "./style.module.css"
import { loginAction } from "../../actions/auth";


export default function Page() {
    return (
        <div className="container">
            <header >
                <h1 className="authTitle">Tech E-Commerce</h1>
            </header>
            <main >
                <AuthForm
                    authType="Login"
                    action="entrar na"
                    buttonAction="Entrar"
                    secondAction="Cria uma"
                    buttonSecondAction="Criar"
                    hrefPage="/register"
                    formAction={loginAction}
                />
            </main>
        </div>
    )
}