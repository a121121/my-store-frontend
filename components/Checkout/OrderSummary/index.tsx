"use client"
import { useState } from "react"
import { useCart } from "@/providers/cart"
import { formatPrice } from "@/lib/price"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, X } from "lucide-react"
import { useSearchParams } from "next/navigation"

export const OrderSummary = () => {
    const { cart, updateItemQuantity } = useCart()
    const [couponCode, setCouponCode] = useState("")
    const [applyCouponLoading, setApplyCouponLoading] = useState(false)
    const searchParams = useSearchParams()
    const currentStep = searchParams.get("step")

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) return
        updateItemQuantity(itemId, quantity)
    }

    const handleRemoveItem = (itemId: string) => {
        // Since there's no removeItem function in the cart context,
        // we'll use updateItemQuantity with 0 quantity to remove it
        updateItemQuantity(itemId, 0)
    }

    const handleApplyCoupon = async () => {
        if (!couponCode.trim() || !cart) return

        setApplyCouponLoading(true)

        try {
            // In a real implementation, you would use the SDK to apply a discount
            // For example:
            // await sdk.store.cart.addDiscount(cart.id, { code: couponCode })

            // For now, just simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
            console.error("Failed to apply coupon:", error)
        } finally {
            setApplyCouponLoading(false)
            setCouponCode("")
        }
    }

    if (!cart) {
        return null
    }

    return (
        <div className="border p-6 rounded-lg sticky top-8">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto mb-4">
                {cart.items?.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                        {/* Display thumbnail if available */}
                        {item.thumbnail && (
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <img
                                    src={item.thumbnail}
                                    // alt={item.title || item.description || "Product"} 
                                    alt={item.title || "Product"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-grow">
                            <div className="flex justify-between">
                                {/* <p className="text-sm font-medium">{item.title || item.description || "Product"}</p> */}
                                <p className="text-sm font-medium">{item.title || "Product"}</p>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Variant options if available */}
                            {item.variant?.options?.map((option) => (
                                <p key={option.id} className="text-xs text-muted-foreground">
                                    {option.option?.title}: {option.value}
                                </p>
                            ))}

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border rounded-md">
                                    <button
                                        className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="px-2 text-sm">{item.quantity}</span>
                                    <button
                                        className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <p className="text-sm font-medium">
                                    {formatPrice(item.unit_price * (item.quantity || 1), cart.region?.currency_code)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Separator className="my-4" />

            {/* Coupon Code */}
            <div className="mb-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Discount code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="h-9"
                    />
                    <Button
                        onClick={handleApplyCoupon}
                        variant="outline"
                        size="sm"
                        disabled={applyCouponLoading || !couponCode.trim()}
                        className="h-9"
                    >
                        {applyCouponLoading ? "Applying..." : "Apply"}
                    </Button>
                </div>

                {/* Display active discounts if any */}
                {/* {cart.discounts && cart.discounts.length > 0 && (
                    <div className="mt-2">
                        {cart.discounts.map((discount: any) => (
                            <div key={discount.id} className="flex justify-between items-center text-sm">
                                <span className="text-green-600">{discount.code} applied</span>
                                <button className="text-xs text-gray-500 hover:text-red-500">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )} */}
            </div>

            <Separator className="my-4" />

            {/* Price breakdown */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-sm">{formatPrice(cart.subtotal || 0, cart.region?.currency_code)}</span>
                </div>

                {cart.shipping_total > 0 && (
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Shipping</span>
                        <span className="text-sm">{formatPrice(cart.shipping_total || 0, cart.region?.currency_code)}</span>
                    </div>
                )}

                {cart.discount_total > 0 && (
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Discount</span>
                        <span className="text-sm text-green-600">
                            -{formatPrice(cart.discount_total || 0, cart.region?.currency_code)}
                        </span>
                    </div>
                )}

                {cart.tax_total > 0 && (
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tax</span>
                        <span className="text-sm">{formatPrice(cart.tax_total || 0, cart.region?.currency_code)}</span>
                    </div>
                )}
            </div>

            <Separator className="my-4" />

            {/* Total */}
            <div className="flex justify-between mb-6">
                <span className="font-medium">Total</span>
                <span className="font-medium">{formatPrice(cart.total || 0, cart.region?.currency_code)}</span>
            </div>

            {/* Next step button - changes based on checkout step */}
            {currentStep === "address" && (
                <Button className="w-full" onClick={() => window.location.href = "/checkout?step=shipping"}>
                    Continue to Shipping
                </Button>
            )}

            {currentStep === "shipping" && (
                <Button className="w-full" onClick={() => window.location.href = "/checkout?step=payment"}>
                    Continue to Payment
                </Button>
            )}

            {currentStep === "payment" && (
                <Button className="w-full">
                    Complete Order
                </Button>
            )}

            {/* Default button if no step is set */}
            {!currentStep && (
                <Button className="w-full" onClick={() => window.location.href = "/checkout?step=address"}>
                    Proceed to Checkout
                </Button>
            )}
        </div>
    )
}