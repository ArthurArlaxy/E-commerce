"use client"

import styles from './styles.module.css'
import { deleteProductFromCart, selectedToBuy, selectQuantity } from "@/actions/cart";
import { formatCurrency } from '@/utils/format';
import { Trash2 } from 'lucide-react';
import Image from "next/image"
import { useEffect, useState, useTransition } from "react";

interface ProductCartProps {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: string;
    quantity: number;
    category: string;
    selected: boolean;
    maxStock: number;
    unavailable: boolean;
}

export function ProductCartCard({ id, slug, name, image, category, price, quantity, selected, maxStock, unavailable }: ProductCartProps) {

    const [isChecked, setIsChecked] = useState(selected)
    const [quantityState, setQuantityState] = useState(quantity)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        setIsChecked(selected)
    }, [selected])

    function checkHandler(id: string, checked: boolean) {
        const previous = isChecked
        setIsChecked(checked)

        startTransition(async () => {
            try {
                await selectedToBuy(id, checked)
            } catch (error: any) {
                setIsChecked(previous)
                console.error(error.message)
            }
        })
    }

    function buttonHandler(id: string, quantity: number) {

        const previous = quantityState
        setQuantityState(quantity)

        startTransition(async () => {
            try {
                await selectQuantity(id, quantity)
            } catch (error: any) {
                setQuantityState(previous)
                console.error(error.message)
            }
        })
    }

    function deleteHandler(id: string) {
        startTransition(async () => {
            try {
                await deleteProductFromCart(id)
            } catch (error: any) {
                console.error(error.message)
            }
        })
    }

    return (
        <a href={`/products/${slug}`} className={`${styles.cartCardContainer} ${unavailable ? styles.unavailable : ""}`}>
            <div className={styles.cartCardImageContainer}>
                <Image
                    fill
                    alt={`Imagem de ${name}`}
                    src={image}
                    className={styles.cartImageCard}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>
            <div className={styles.cartInfo}>
                <p className={styles.cartNameCard}>{name}</p>
                <p className={styles.cartCategoryCard}>{category}</p>
                <span className={styles.cartQuantitySpan}>
                    <p className={styles.cartQuantityCard}>{`Quantidade:`}</p>
                    <div className={styles.cartQuantityDiv}>
                        <button
                            type='button'
                            className={styles.quantityBtn}
                            disabled={isPending || maxStock <= quantityState || unavailable}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                buttonHandler(id, quantityState + 1)
                            }}>
                            +
                        </button>
                        <p>{quantityState}</p>
                        <button
                            className={styles.quantityBtn}
                            type='button'
                            disabled={isPending || quantityState <= 1 || unavailable}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                buttonHandler(id, quantityState - 1)
                            }}>
                            -
                        </button>
                    </div>
                </span>
            </div>
            <div className={styles.actionsBtnDiv}>
                <div className={styles.cartBuyInfo}>
                    <p className={styles.cartPriceCard}>{formatCurrency(Number(price) * quantityState)}</p>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isPending || unavailable}
                        className={styles.cartSelectCard}
                        onChange={(e) => checkHandler(id, e.target.checked)} />
                </div>
                <button
                    type='button'
                    className={styles.trashBtn}
                    disabled={isPending}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        deleteHandler(id)
                    }}
                >
                    <Trash2 />
                </button>
            </div>
        </a>
    )
}