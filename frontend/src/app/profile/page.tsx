import { getUserAddress } from "@/actions/address"
import { getProfile } from "@/actions/auth"
import Button from "@/components/Button"
import { AddressManagerForm } from "@/components/forms/addressManagerForm"
import { UserUpdateForm } from "@/components/forms/userUpdateForm"
import { SelectTheme } from "@/components/inputs/selectTheme"
import styles from "./style.module.css"
import { Logout } from "@/components/forms/Logout"


export default async function Page(){

    const userInfo = await getProfile()

    let addresses = await getUserAddress()

    if("error" in addresses){
        addresses = []
    }

    return(
        <main className={`pageContainer ${styles.mainContainer}`}>
            <h1 className="sectionTitle">{`Profile`}</h1>
            <h2 className={`titlew`}>{`Olá, ${userInfo.name}`}</h2>
            <section className={styles.settingsSection}>
                <AddressManagerForm addresses={addresses}/>
                <UserUpdateForm user={userInfo} />
                <SelectTheme />
                <Logout/>
            </section>
            <section className={styles.redirectSection}>
                <Button text="Ver Carrinho" href="/cart" />
                <Button text="Ver Pedidos" href="/orders" />
            </section>
        </main>
    )
}   