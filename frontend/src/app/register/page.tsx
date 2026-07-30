import AuthForm from "@/components/authForm";
import { registerAction } from "@/app/actions/auth";

export default function Page() {
    return (
        <div className="container">
            <header>
                <h1 className="authTitle">Tech E-Commerce</h1>
            </header>
            <main>
                <AuthForm
                    authType="Registrar"
                    action="criar a"
                    buttonAction="Criar"
                    secondAction="Entrar em uma"
                    buttonSecondAction="Entrar"
                    hrefPage="/login"
                    formAction={registerAction}
                />
            </main>
        </div>
    )
}