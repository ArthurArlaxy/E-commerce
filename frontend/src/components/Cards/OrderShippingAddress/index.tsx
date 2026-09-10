import styles from './styles.module.css'

interface OrderShippingAddressProps {
    shippingStreet: string
    shippingNumber: string | null
    shippingComplement: string | null
    shippingNeighborhood: string
    shippingCity: string
    shippingState: string
    shippingZipCode: string
}

export function OrderShippingAddress({ shippingStreet, shippingNumber, shippingComplement, shippingNeighborhood, shippingCity, shippingState, shippingZipCode }: OrderShippingAddressProps) {
    return (
        <div className={styles.addressContainer}>
            <p className={styles.addressLabel}>Endereço de entrega</p>
            <p className={styles.addressText}>
                {`${shippingStreet}, ${shippingNumber ?? "s/n"}`}
                {shippingComplement ? ` - ${shippingComplement}` : ""}
            </p>
            <p className={styles.addressText}>
                {`${shippingNeighborhood}, ${shippingCity} - ${shippingState}, ${shippingZipCode}`}
            </p>
        </div>
    )
}