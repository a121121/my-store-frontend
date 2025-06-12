"use client"

import {
    useState, useEffect, useCallback, useMemo
} from "react"
import { useCart } from "@/providers/cart"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { sdk } from "@/lib/sdk"
import { formatPrice } from "@/lib/price"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

type ShippingProps = {
    isActive: boolean
}

export const Shipping = ({
    isActive,
}: ShippingProps) => {
    const { cart, updateCart } = useCart()
    const [loading, setLoading] = useState(true)
    const [shippingMethod, setShippingMethod] = useState(
        cart?.shipping_methods?.[0]?.shipping_option_id || ""
    )
    const [shippingOptions, setShippingOptions] = useState<
        HttpTypes.StoreCartShippingOption[]
    >([])
    const [calculatedPrices, setCalculatedPrices] = useState<
        Record<string, number>
    >({})
    const [optionsFetched, setOptionsFetched] = useState(false)
    const router = useRouter()

    // Fetch shipping options only once when cart is available
    useEffect(() => {
        if (!cart || optionsFetched) {
            return
        }

        console.log("Fetching shipping options for cart:", cart.id)

        sdk.store.fulfillment.listCartOptions({
            cart_id: cart.id || "",
        })
            .then(({ shipping_options }) => {
                console.log("Received shipping options:", shipping_options)
                setShippingOptions(shipping_options)
                setOptionsFetched(true)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching shipping options:", error)
                setLoading(false)
            })
    }, [cart?.id, optionsFetched]) // Only depend on cart.id and optionsFetched flag

    // Calculate prices for dynamic pricing options
    useEffect(() => {
        if (!cart || !shippingOptions.length || !optionsFetched) {
            return
        }

        const calculatedOptions = shippingOptions.filter(
            (shippingOption) => shippingOption.price_type === "calculated"
        )

        if (calculatedOptions.length === 0) {
            return
        }

        console.log("Calculating prices for options:", calculatedOptions)

        const promises = calculatedOptions.map((shippingOption) =>
            sdk.client.fetch(
                `/store/shipping-options/${shippingOption.id}/calculate`,
                {
                    method: "POST",
                    body: {
                        cart_id: cart.id,
                        data: {
                            // pass any custom data useful for price calculation
                        },
                    },
                }
            ) as Promise<{ shipping_option: HttpTypes.StoreCartShippingOption }>
        )

        Promise.allSettled(promises).then((res) => {
            const pricesMap: Record<string, number> = {}
            res
                .filter((r) => r.status === "fulfilled")
                .forEach((p) => {
                    if (p.status === "fulfilled") {
                        pricesMap[p.value?.shipping_option.id || ""] =
                            p.value?.shipping_option.amount
                    }
                })

            console.log("Calculated prices:", pricesMap)
            setCalculatedPrices(pricesMap)
        })
    }, [cart?.id, shippingOptions, optionsFetched])

    // Update shipping method when cart changes
    useEffect(() => {
        if (cart?.shipping_methods?.[0]?.shipping_option_id) {
            setShippingMethod(cart.shipping_methods[0].shipping_option_id)
        }
    }, [cart?.shipping_methods])

    const getShippingOptionPrice = useCallback(
        (shippingOption: HttpTypes.StoreCartShippingOption) => {
            const price = shippingOption.price_type === "flat" ?
                shippingOption.amount : calculatedPrices[shippingOption.id]

            return formatPrice(price || 0, cart?.currency_code)
        }, [calculatedPrices, cart?.currency_code]
    )

    const isButtonDisabled = useMemo(() => {
        return loading || !shippingMethod
    }, [shippingMethod, loading])

    const handleSubmit = () => {
        if (isButtonDisabled) {
            return
        }

        setLoading(true)

        updateCart({
            shippingMethodData: {
                option_id: shippingMethod,
                data: {
                    // Any data necessary for fulfillment provider
                },
            },
        })
            .then(() => {
                setLoading(false)
                router.push(`/checkout?step=payment`)
            })
            .catch((error) => {
                console.error("Error updating cart with shipping method:", error)
                setLoading(false)
            })
    }

    // Check if shipping is already set up
    const isShippingComplete = useMemo(() => {
        return cart?.shipping_methods && cart.shipping_methods.length > 0
    }, [cart])

    // Find the selected shipping method name
    const selectedShippingMethodName = useMemo(() => {
        if (!cart?.shipping_methods?.length) return null

        const method = shippingOptions.find(
            option => option.id === cart.shipping_methods?.[0]?.shipping_option_id
        )
        return method?.name
    }, [cart, shippingOptions])

    if (!isActive && isShippingComplete) {
        return (
            <div className="mb-6">
                <div className="flex items-center justify-between border p-4 rounded-lg bg-gray-50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">Shipping Method</h3>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {selectedShippingMethodName || "Selected shipping method"}
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => router.push("/checkout?step=shipping")}>
                        Edit
                    </Button>
                </div>
            </div>
        )
    }

    if (!isActive) {
        return null
    }

    // Debug information
    console.log("Shipping component render:", {
        loading,
        cartId: cart?.id,
        shippingOptionsCount: shippingOptions.length,
        optionsFetched,
        shippingMethod
    })

    if (loading) {
        return (
            <div className="border p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                <div className="flex justify-center p-8">
                    <div className="text-sm text-muted-foreground">Loading shipping options...</div>
                </div>
            </div>
        )
    }

    if (shippingOptions.length === 0) {
        return (
            <div className="border p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                <div className="flex justify-center p-8">
                    <div className="text-sm text-muted-foreground">
                        No shipping options available for this cart.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="border p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <RadioGroup
                        value={shippingMethod}
                        onValueChange={(value) => setShippingMethod(value)}
                        className="flex flex-col gap-4"
                    >
                        {shippingOptions.map((shippingOption) => (
                            <div className="flex items-center gap-2 border p-3 rounded-md" key={shippingOption.id}>
                                <RadioGroupItem id={shippingOption.id} value={shippingOption.id} />
                                <Label
                                    htmlFor={shippingOption.id}
                                    className="flex justify-between w-full gap-2 cursor-pointer"
                                >
                                    <span className="text-sm">{shippingOption.name}</span>
                                    <span className="text-sm">
                                        {getShippingOptionPrice(shippingOption)}
                                    </span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <Separator className="my-2" />
                <Button
                    disabled={isButtonDisabled}
                    onClick={handleSubmit}
                    className="w-full"
                    variant="default"
                >
                    Continue to Payment
                </Button>
            </div>
        </div>
    )
}