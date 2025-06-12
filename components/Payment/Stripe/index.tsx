"use client"

import {
    PaymentElement,
    Elements,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useCart } from "@/providers/cart"
import { useState, useEffect } from "react"

const stripe = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PK || "", {
    // stripeAccount: process.env.NEXT_PUBLIC_ACCOUNT_ID || ""
    stripeAccount: "acct_1NwfYtF6WihPsWqo"
}
)

export default function StripePayment() {
    const { cart } = useCart()
    const clientSecret = cart?.payment_collection?.
        payment_sessions?.[0]?.data?.client_secret as string

    // Don't render if no client secret
    if (!clientSecret) {
        return <div className="text-sm text-muted-foreground">Loading payment form...</div>
    }

    // to be omitted
    useEffect(() => {
        console.log("StripePayment mounted with clientSecret:", clientSecret)
    }, [clientSecret])

    return (
        <div className="mt-4">
            <Elements stripe={stripe} options={{
                clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#0570de',
                        colorBackground: '#ffffff',
                        colorText: '#30313d',
                        colorDanger: '#df1b41',
                        fontFamily: 'system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '6px',
                    }
                }
            }}>
                <StripeForm />
            </Elements>
        </div>
    )
}

const StripeForm = () => {
    const { cart } = useCart()
    const [error, setError] = useState<string | null>(null)
    const [isReady, setIsReady] = useState(false)

    const stripe = useStripe()
    const elements = useElements()

    // Check if elements are ready
    useEffect(() => {
        if (stripe && elements) {
            setIsReady(true)
        }
    }, [stripe, elements])

    // Handle form submission - this is only for payment method setup
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) {
            setError("Payment system not ready. Please try again.")
            return
        }

        setError(null)

        // Just validate the payment element without submitting
        const { error } = await elements.submit()
        if (error) {
            setError(error.message || "Please check your payment information.")
        }
    }

    if (!isReady) {
        return <div className="text-sm text-muted-foreground">Loading payment form...</div>
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-md">
                <PaymentElement
                    options={{
                        layout: "tabs"
                    }}
                />
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <span className="text-sm text-red-800">{error}</span>
                </div>
            )}

            <div className="text-xs text-gray-500 text-center">
                Your payment information is securely processed by Stripe.
                <br />
                Complete your order using the "Pay" button below.
            </div>
        </form>
    )
}