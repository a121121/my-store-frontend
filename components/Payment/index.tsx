"use client"

import {
    useState, useEffect, useMemo
} from "react"
import { useCart } from "@/providers/cart"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { sdk } from "@/lib/sdk"
import { CustomCard } from "@/components/CustomCard"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { formatPrice } from "@/lib/price"

type PaymentProps = {
    handle: string
    isActive: boolean
}

export const Payment = ({
    handle,
    isActive,
}: PaymentProps) => {
    const { cart, updateItemQuantity, unsetCart } = useCart()
    const [loading, setLoading] = useState(true)
    const [paymentProviders, setPaymentProviders] = useState<
        HttpTypes.StorePaymentProvider[]
    >([])
    const [selectedPaymentProvider, setSelectedPaymentProvider] = useState("")
    const router = useRouter()

    useEffect(() => {
        if (!loading || !cart) {
            return
        }

        sdk.store.payment.listPaymentProviders({
            region_id: cart.region_id || "",
        })
            .then(({ payment_providers }) => {
                setPaymentProviders(payment_providers)
                setLoading(false)
            })
    }, [loading, cart])

    const handleSelectProvider = async () => {
        if (!selectedPaymentProvider || !cart) {
            return
        }

        setLoading(true)

        sdk.store.payment.initiatePaymentSession(cart, {
            provider_id: selectedPaymentProvider,
        })
            .then(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if (!selectedPaymentProvider || !cart) {
            return
        }

        handleSelectProvider()
    }, [selectedPaymentProvider])

    const paymentUi = useMemo(() => {
        if (!selectedPaymentProvider) {
            return
        }

        switch (selectedPaymentProvider) {
            // TODO handle other providers
            default:
                return <></>
        }
    }, [selectedPaymentProvider])

    const canPlaceOrder = useMemo(() => {
        switch (selectedPaymentProvider) {
            case "":
                return false
            // TODO handle other providers
            default:
                return true
        }
    }, [selectedPaymentProvider])

    const placeOrder = () => {
        if (!cart || !canPlaceOrder) {
            return
        }
        setLoading(true)

        sdk.store.cart.complete(cart.id)
            .then((data) => {
                if (data.type === "cart") {
                    alert(data.error.message)
                    setLoading(false)
                } else {
                    unsetCart()
                    // redirect to confirmation page
                    router.push(`/confirmation/${data.order.id}`)
                }
            })
    }

    const getProviderTitle = (providerId: string) => {
        switch (true) {
            case providerId.startsWith("pp_system_default"):
                return "Cash on Delivery"
            default:
                return providerId
        }
    }

    return (
        <CustomCard
            title="Payment"
            isActive={isActive}
            isDone={false}
            path={`/${handle}?step=payment`}
        >
            <div className="flex flex-col gap-4">
                <span className="text-sm font-medium">Your order</span>
                {cart?.items?.map((item) => (
                    <div className="flex gap-2" key={item.id}>
                        <img src={item.thumbnail} alt={item.title} className="w-24 h-24 rounded object-cover" />
                        <div className="flex flex-col gap-3">
                            <span className="text-base">{item.product_title}</span>
                            {item.variant?.options?.map((option) => (
                                <span className="flex gap-1 text-sm" key={option.id}>
                                    <span className="text-muted-foreground">{option.option?.title}</span>
                                    <span>{option.value}</span>
                                </span>
                            ))}
                            <span className="flex gap-2 text-sm items-center">
                                <span className="text-muted-foreground">Quantity</span>
                                <Input
                                    type="number"
                                    className="w-20 h-8"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        if (!e.target.value) {
                                            return
                                        }
                                        updateItemQuantity(item.id, parseInt(e.target.value))
                                    }}
                                />
                            </span>
                        </div>
                    </div>
                ))}

                <Separator />

                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal:</span>
                    <span className="text-sm font-medium">{formatPrice(
                        cart?.item_subtotal || 0,
                        cart?.currency_code
                    )}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Shipping & handling:</span>
                    <span className="text-sm font-medium">{formatPrice(
                        cart?.shipping_total || 0,
                        cart?.currency_code
                    )}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <span className="text-sm font-medium">{formatPrice(
                        cart?.total || 0,
                        cart?.currency_code
                    )}</span>
                </div>

                <Separator />

                <span className="text-sm font-medium">Delivery address</span>
                <p className="text-xs text-muted-foreground">
                    {cart?.shipping_address?.first_name} {cart?.shipping_address?.last_name}<br />
                    {cart?.shipping_address?.address_1}<br />
                    {cart?.shipping_address?.city}, {cart?.shipping_address?.postal_code}, {cart?.shipping_address?.country_code}<br />
                </p>

                <Separator />

                <span className="text-sm font-medium">Payment method</span>
                <div className="flex flex-col gap-2">
                    <RadioGroup
                        value={selectedPaymentProvider}
                        onValueChange={(value) => setSelectedPaymentProvider(value)}
                        className="flex flex-col gap-2"
                    >
                        {paymentProviders.map((paymentProvider) => (
                            <div className="flex items-center gap-2" key={paymentProvider.id}>
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

                <Separator />

                <Button
                    className="w-full"
                    disabled={!canPlaceOrder || loading}
                    onClick={placeOrder}
                    variant="default"
                >
                    Pay {formatPrice(
                        cart?.total || 0,
                        cart?.currency_code
                    )}
                </Button>
            </div>
        </CustomCard>
    )
}