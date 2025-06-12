"use client"

import {
    useState, useEffect, useMemo, useCallback
} from "react"
import { useCart } from "@/providers/cart"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { sdk } from "@/lib/sdk"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/price"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import StripePayment from "@/components/Payment/Stripe"

type PaymentProps = {
    isActive: boolean
}

export const Payment = ({
    isActive,
}: PaymentProps) => {
    const { cart, unsetCart, refreshCart } = useCart()
    const [loading, setLoading] = useState(true)
    const [processingOrder, setProcessingOrder] = useState(false)
    const [paymentProviders, setPaymentProviders] = useState<
        HttpTypes.StorePaymentProvider[]
    >([])
    const [selectedPaymentProvider, setSelectedPaymentProvider] = useState("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!isActive || !cart) {
            return
        }

        setLoading(true)
        sdk.store.payment.listPaymentProviders({
            region_id: cart.region_id || "",
        })
            .then(({ payment_providers }) => {
                setPaymentProviders(payment_providers)
                setLoading(false)
            })
            .catch(() => {
                setError("Could not load payment providers")
                setLoading(false)
            })
    }, [isActive, cart])

    // const handleSelectProvider = async () => {
    //     if (!selectedPaymentProvider || !cart) {
    //         return
    //     }

    //     setLoading(true)
    //     setError(null)

    //     sdk.store.payment.initiatePaymentSession(cart, {
    //         provider_id: selectedPaymentProvider,
    //     })
    //         .then(() => {
    //             setLoading(false)
    //         })
    //         .catch((err) => {
    //             setError("Could not initiate payment session")
    //             setLoading(false)
    //         })
    // }
    const handleSelectProvider = useCallback(async () => {
        if (!selectedPaymentProvider || !cart) return;

        setLoading(true);

        const currentProvider = cart.payment_collection?.payment_sessions?.[0]?.provider_id;

        try {
            if (currentProvider !== selectedPaymentProvider) {
                console.log("🔄 Switching payment provider...");
                await sdk.store.payment.initiatePaymentSession(cart, {
                    provider_id: selectedPaymentProvider,
                });

                // We MUST retrieve the latest cart right after that
                await refreshCart();
            } else {
                console.log("✅ Already using selected provider:", selectedPaymentProvider);
            }
        } catch (error) {
            console.error("❌ Error updating payment session:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedPaymentProvider, cart, refreshCart]);


    useEffect(() => {
        if (!selectedPaymentProvider || !cart) {
            return
        }

        handleSelectProvider()
    }, [selectedPaymentProvider])

    // const paymentUi = useMemo(() => {
    //     if (!selectedPaymentProvider) {
    //         return
    //     }

    //     switch (selectedPaymentProvider) {
    //         // Handle specific payment UIs here
    //         default:
    //             return <></>
    //     }
    // }, [selectedPaymentProvider])


    const paymentUi = useMemo(() => {
        const activePaymentSession = cart?.payment_collection?.payment_sessions?.[0]
        console.log("activePaymentSession:", activePaymentSession);
        console.log("selectedPaymentProvider:", selectedPaymentProvider);
        if (!activePaymentSession || activePaymentSession.provider_id !== selectedPaymentProvider) {

            console.log("returning null")
            return null

        }

        switch (true) {
            case activePaymentSession.provider_id.startsWith("pp_stripe_"):
                return <StripePayment />
            case activePaymentSession.provider_id.startsWith("pp_system_default"):
                return <div className="text-sm">Cash on Delivery selected. No additional payment required.</div>
            default:
                return <div className="text-sm">Selected payment method: {activePaymentSession.provider_id}</div>
        }
    }, [cart, selectedPaymentProvider])

    const canPlaceOrder = useMemo(() => {
        if (!selectedPaymentProvider) return false

        switch (selectedPaymentProvider) {
            // Handle specific payment validations here
            default:
                // For simplicity, we'll allow all payment methods to proceed
                return true
        }
    }, [selectedPaymentProvider])

    const placeOrder = () => {
        if (!cart || !canPlaceOrder) {
            return
        }

        setProcessingOrder(true)
        setError(null)

        sdk.store.cart.complete(cart.id)
            .then((data) => {
                if (data.type === "cart") {
                    setError(data.error.message)
                    setProcessingOrder(false)
                } else {
                    unsetCart()
                    // Redirect to confirmation page
                    router.push(`/confirmation/${data.order.id}`)
                }
            })
            .catch((err) => {
                setError("Could not complete your order. Please try again.")
                setProcessingOrder(false)
            })
    }

    const getProviderTitle = (providerId: string) => {
        switch (true) {
            case providerId.startsWith("pp_system_default"):
                return "Cash on Delivery"
            case providerId.includes("stripe"):
                return "Credit Card (Stripe)"
            case providerId.includes("paypal"):
                return "PayPal"
            default:
                return providerId
        }
    }

    if (!isActive) {
        return null
    }

    return (
        <div className="border p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <RadioGroup
                        value={selectedPaymentProvider}
                        onValueChange={(value) => setSelectedPaymentProvider(value)}
                        className="flex flex-col gap-4"
                    >
                        {paymentProviders.map((paymentProvider) => (
                            <div className="flex items-center gap-2 border p-3 rounded-md" key={paymentProvider.id}>
                                <RadioGroupItem id={paymentProvider.id} value={paymentProvider.id} />
                                <Label
                                    htmlFor={paymentProvider.id}
                                    className="flex justify-between w-full gap-2 cursor-pointer"
                                >
                                    <span className="text-sm">{getProviderTitle(paymentProvider.id)}</span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {paymentUi}

                <Separator className="my-2" />

                <Button
                    className="w-full"
                    disabled={!canPlaceOrder || loading || processingOrder}
                    onClick={placeOrder}
                    variant="default"
                >
                    {processingOrder ? "Processing..." : `Complete Order - ${formatPrice(
                        cart?.total || 0,
                        cart?.currency_code
                    )}`}
                </Button>
            </div>
        </div>
    )
}