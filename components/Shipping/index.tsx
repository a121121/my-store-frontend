"use client"

import {
    useState, useEffect, useCallback, useMemo
} from "react"
import { useCart } from "@/providers/cart"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { sdk } from "@/lib/sdk"
import { formatPrice } from "@/lib/price"

import { CustomCard } from "@/components/CustomCard"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"

type ShippingProps = {
    handle: string
    isActive: boolean
}

export const Shipping = ({
    handle,
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
    const router = useRouter()

    useEffect(() => {
        if (shippingOptions.length || !cart) {
            return
        }

        sdk.store.fulfillment.listCartOptions({
            cart_id: cart.id || "",
        })
            .then(({ shipping_options }) => {
                setShippingOptions(shipping_options)
                setLoading(false)
            })
    }, [shippingOptions, cart])

    useEffect(() => {
        if (!cart || !shippingOptions.length) {
            return
        }

        const promises = shippingOptions
            .filter((shippingOption) => shippingOption.price_type === "calculated")
            .map((shippingOption) =>
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

        if (promises.length) {
            Promise.allSettled(promises).then((res) => {
                const pricesMap: Record<string, number> = {}
                res
                    .filter((r) => r.status === "fulfilled")
                    .forEach((p) => (
                        pricesMap[p.value?.shipping_option.id || ""] =
                        p.value?.shipping_option.amount
                    ))

                setCalculatedPrices(pricesMap)
            })
        }
    }, [shippingOptions, cart])

    const getShippingOptionPrice = useCallback(
        (shippingOption: HttpTypes.StoreCartShippingOption) => {
            const price = shippingOption.price_type === "flat" ?
                shippingOption.amount : calculatedPrices[shippingOption.id]

            return formatPrice(price || 0, cart?.currency_code)
        }, [calculatedPrices]
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
                    // TODO add any data necessary for
                    // fulfillment provider
                },
            },
        })
            .then(() => {
                setLoading(false)
                router.push(`/${handle}?step=payment`)
            })
    }

    return (
        <CustomCard
            title="Shipping"
            isActive={isActive}
            isDone={!!cart?.shipping_methods?.length}
            path={`/${handle}?step=shipping`}
        >
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <RadioGroup
                        value={shippingMethod}
                        onValueChange={(value) => setShippingMethod(value)}
                        className="flex flex-col gap-2"
                    >
                        {shippingOptions.map((shippingOption) => (
                            <div className="flex items-center gap-2" key={shippingOption.id}>
                                <RadioGroupItem id={shippingOption.id} value={shippingOption.id} />
                                <Label
                                    htmlFor={shippingOption.id}
                                    className="flex justify-between w-full gap-2 cursor-pointer"
                                >
                                    <span className="text-sm">{shippingOption.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {getShippingOptionPrice(shippingOption)}
                                    </span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <Separator className="my-1" />
                <Button
                    disabled={isButtonDisabled}
                    onClick={handleSubmit}
                    className="w-full"
                    variant="default"
                >
                    Go to payment
                </Button>
            </div>
        </CustomCard>
    )
}