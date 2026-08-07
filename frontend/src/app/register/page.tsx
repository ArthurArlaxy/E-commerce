import AuthForm from "@/components/forms/authForm";
import { registerAction } from "@/actions/auth";

export default function Page() {
    return (
        <div className="container">
            <header>
                <h1 className="title">Tech E-Commerce</h1>
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