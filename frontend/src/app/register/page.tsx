import AuthForm from "@/components/forms/authForm";
import { registerAction } from "@/actions/auth";

export default function Page() {
    return (
        <main className="container">
            <h1 className="title">Tech E-Commerce</h1>
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
    )
}