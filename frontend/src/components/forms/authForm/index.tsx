"use client"

import FormInput from "@/components/inputs/formInput";
import styles from "./style.module.css"
import Button from "../../Button";
import { useActionState } from "react";

interface AuthState {
    error?: string;
}

interface AuthFormProps {
    authType: string;
    action: string;
    secondAction: string;
    buttonAction: string;
    buttonSecondAction: string;
    hrefPage: string;
    formAction: (prevState: AuthState, formData: FormData) => Promise<AuthState>;
}

const initialState: AuthState = {};

export default function AuthForm({
    authType,
    action,
    buttonAction,
    secondAction,
    buttonSecondAction,
    hrefPage,
    formAction,
}: AuthFormProps) {
    const [state, formActionHandler, isPending] = useActionState(formAction, initialState);

    return (
        <>
            <form className={styles.form} action={formActionHandler}>
                <h2 className={styles.subTitle}>{authType}</h2>
                <p className={styles.p}>Insira e-mail e senha para {action} sua conta.</p>

                {authType === "Registrar" && (
                    <FormInput inputName="name" placeholder="Digite seu Nome" />
                )}
                <FormInput inputName="email" placeholder="Email@dominio.com" />
                <FormInput inputName="password" placeholder="Insira uma senha" />

                {state?.error && <p className={styles.errorText}>{state.error}</p>}

                <p className={styles.termoText}>
                    Ao clicar em continuar, você concorda com os nossos{" "}
                    <strong><a href="/termo">Termos de Serviço</a></strong> e com a{" "}
                    <strong><a href="/termo">Política de Privacidade</a></strong>
                </p>

                <Button text={isPending ? "Aguarde..." : buttonAction} />
            </form>
            <hr />
            <div className={styles.section}>
                <p className={styles.p}>OU</p>
                <p className={styles.p}>{secondAction} conta</p>
                <Button text={buttonSecondAction} href={hrefPage} />
            </div>
        </>
    )
}