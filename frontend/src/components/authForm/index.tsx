"use client"


import FormInput from "@/components/formInput";
import styles from "./style.module.css"
import Button from "../Button";
import { useState } from "react";

interface AuthFormProps {
    authType: string;
    action: string;
    secondAction: string;
    buttonAction: string;
    buttonSecondAction: string;
}

export default function AuthForm({ authType, action, buttonAction, secondAction, buttonSecondAction }: AuthFormProps) {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        async function handleSubmit(e: React.FormEvent) {
            e.preventDefault();

            console.log(email, password);

            // aqui você chama sua API
        }
        return (
            <>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2 className={styles.subTitle}>{authType}</h2>
                    <p className={styles.p}>Insira e-mail e senha para {action} sua conta.</p>
                    <FormInput
                        inputName="Email"
                        placeholder="Email@dominio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <FormInput
                        inputName="Senha"
                        placeholder="Insira uma senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className={styles.termoText}>Ao clicar em continuar, você concorda com os nossos <strong><a href="/termo">Termos de Serviço</a></strong> e com a <strong><a href="/termo">Política de Privacidade</a></strong></p>
                    <Button text={buttonAction} />
                </form>
                <hr />
                <div className={styles.section}>
                    <p className={styles.p}>OU</p>
                    <p className={styles.p}>{secondAction} conta</p>
                    <Button text={buttonSecondAction} />
                </div>
            </>
        )
    }