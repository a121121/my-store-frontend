"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/providers/cart";
import Image from "next/image";
import { HttpTypes } from "@medusajs/types";
import { toast } from "sonner";
import Link from "next/link"; // make sure this is imported

type StoreCartLineItem = HttpTypes.StoreCartLineItem;
type StoreCart = HttpTypes.StoreCart;

export default function CartSheet() {
    const { cart, updateItemQuantity, refreshCart, unsetCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleQuantityUpdate = async (itemId: string, quantity: number) => {
        if (quantity < 1 || !cart) return;

        setIsUpdating(itemId);
        try {
            await updateItemQuantity(itemId, quantity);
            await refreshCart();
        } catch (error) {
            toast.error("Failed to update quantity. Please try again.");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if (!cart) return;

        setIsUpdating(itemId);
        try {
            await updateItemQuantity(itemId, 0);
            // After setting quantity to 0, we need to refresh the cart to remove the item
            await refreshCart();
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error("Failed to remove item. Please try again.");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleClearCart = async () => {
        try {
            await unsetCart();
            await refreshCart();
            toast.success("Cart cleared successfully.");
        } catch (error) {
            toast.error("Failed to clear cart. Please try again.");
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: cart?.region?.currency_code?.toUpperCase() || "USD",
        }).format(price);
    };

    // Filter out items with quantity 0 before counting or displaying
    const validItems = cart?.items?.filter(item => item.quantity > 0) || [];
    const itemCount = validItems.length;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {itemCount > 0 && (
                        <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                            {itemCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
                <SheetHeader className="px-4 pt-4 pb-3 border-b">
                    <SheetTitle className="flex items-center gap-2 text-base">
                        <ShoppingBag className="h-5 w-5" />
                        <span>Your Cart</span>
                        {itemCount > 0 && (
                            <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                                {itemCount}
                            </Badge>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 flex flex-col">
                    {!cart || itemCount === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-4 py-8 gap-3">
                            <div className="p-4 bg-muted/50 rounded-full">
                                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-lg">Your cart is empty</h3>
                            <p className="text-muted-foreground text-sm text-center max-w-xs">
                                Start shopping to add items to your cart
                            </p>
                            <Button
                                className="mt-2"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-2 bg-muted/30 flex justify-between items-center">
                                <div className="grid grid-cols-4 text-xs text-muted-foreground font-medium w-full">
                                    <span className="col-span-2">Product</span>
                                    <span className="text-center">Qty</span>
                                    <span className="text-right">Price</span>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 px-4">
                                <div className="py-2 space-y-3">
                                    {validItems.map((item) => {
                                        const title = item.title || item.variant?.title || "Product";
                                        const thumbnail = item.thumbnail || "/placeholder.jpg";
                                        const price = (item.unit_price * item.quantity);
                                        const unitPrice = item.unit_price;

                                        return (
                                            <div key={item.id} className="grid grid-cols-4 gap-3 items-center py-2">
                                                <div className="col-span-2 flex items-center gap-3">
                                                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                                                        <Image
                                                            src={thumbnail}
                                                            alt={title}
                                                            fill
                                                            sizes="48px"
                                                            className="object-cover"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{title}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatPrice(unitPrice)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-center">
                                                    <div className="flex items-center border rounded-md h-8">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-6 px-0 rounded-r-none"
                                                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                                            disabled={isUpdating === item.id || item.quantity <= 1}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <div className="w-8 text-center text-xs">
                                                            {isUpdating === item.id ? (
                                                                <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-muted-foreground animate-spin mx-auto" />
                                                            ) : (
                                                                item.quantity
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-6 px-0 rounded-l-none"
                                                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                                            disabled={isUpdating === item.id}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end gap-1">
                                                    <span className="text-sm font-medium">
                                                        {formatPrice(price)}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        disabled={isUpdating === item.id}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>

                            <div className="px-4 py-3 border-t">
                                <div className="space-y-2 text-sm">
                                    {cart.shipping_total && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="font-medium">
                                                {formatPrice(cart.shipping_total)}
                                            </span>
                                        </div>
                                    )}

                                    {cart.tax_total && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tax</span>
                                            <span className="font-medium">
                                                {formatPrice(cart.tax_total)}
                                            </span>
                                        </div>
                                    )}

                                    <Separator className="my-2" />

                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>{formatPrice((cart.total || 0))}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {itemCount > 0 && (
                    <SheetFooter className="px-4 py-3 border-t">
                        <div className="w-full space-y-2">


                            <Link href="/checkout" onClick={() => setIsOpen(false)}>
                                <Button className="w-full" size="sm">
                                    Proceed to Checkout
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Continue Shopping
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1"
                                    onClick={handleClearCart}
                                    disabled={isUpdating !== null}
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}