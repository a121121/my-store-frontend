"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/providers/cart"
import { useEffect, useMemo } from "react"
import { Address } from "../Address"
import { Shipping } from "../Shipping"
import { Payment } from "../Payment"
import { OrderSummary } from "../OrderSummary"

type ActiveTab = "address" | "shipping" | "payment"

export const CheckoutRouter = () => {
    const { cart } = useCart()
    const searchParams = useSearchParams()
    const router = useRouter()
    const currentStep = searchParams.get("step")

    const activeTab: ActiveTab = currentStep === "address" ||
        currentStep === "shipping" || currentStep === "payment" ? currentStep as ActiveTab : "address"


    const cartLoaded = useMemo(() => cart !== undefined, [cart]);
    useEffect(() => {
        if (!cartLoaded) return

        if (!cart || !cart.items || cart.items.length === 0) {
            router.push('/')
            return
        }

        if (activeTab === "shipping" && (!cart?.shipping_address || !cart?.billing_address)) {
            return router.push(`/checkout?step=address`)
        }

        if (activeTab === "payment" && (
            !cart?.shipping_address || !cart?.billing_address || !cart?.shipping_methods?.length
        )) {
            return router.push(`/checkout?step=shipping`)
        }
    }, [cart, cartLoaded, activeTab, router])

    const hasItems = useMemo(() => {
        return cart?.items && cart.items.length > 0
    }, [cart])

    if (!hasItems) {
        return <div className="container py-12 flex items-center justify-center">
            <p>Your cart is empty. Please add items to proceed with checkout.</p>
        </div>
    }

    return (
        <div className="container py-12">
            <h1 className="text-2xl font-bold mb-8">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8">
                    <Address isActive={activeTab === "address"} />
                    <Shipping isActive={activeTab === "shipping"} />
                    <Payment isActive={activeTab === "payment"} />
                </div>
                <div className="md:col-span-4">
                    <OrderSummary />
                </div>
            </div>
        </div>
    )
}