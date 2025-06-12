import { sdk } from "@/lib/sdk";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, MapPin, Truck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Params = {
    params: { id: string };
};

export default async function ConfirmationPage({ params }: Params) {
    const orderId = params.id;
    const { order } = await sdk.store.order.retrieve(orderId);
    const currency_code = order.currency_code.toUpperCase();

    // Format date with time
    const formattedDate = new Date(order.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Calculate estimated delivery date (3-5 business days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
            {/* Success Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                <CheckCircle className="text-green-600 h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                    <h1 className="text-lg font-medium text-green-800">Order confirmed!</h1>
                    <p className="text-green-700 mt-1">
                        We've received your order #{order.display_id} and are preparing it for shipment.
                        A confirmation email has been sent to {order.email}.
                    </p>
                </div>
            </div>

            {/* Order Summary Card */}
            <Card className="shadow-sm border border-muted">
                <CardContent className="py-6 px-4 sm:px-6 md:px-8 space-y-6">
                    {/* Order Status Timeline */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            Order Summary
                        </h2>

                        <div className="relative">
                            <div className="absolute left-4 top-0 h-full w-0.5 bg-muted" />
                            <div className="space-y-6">
                                {/* Order Placed */}
                                <div className="relative flex gap-4">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">Order placed</h3>
                                        <p className="text-sm text-muted-foreground">{formattedDate}</p>
                                    </div>
                                </div>

                                {/* Processing */}
                                <div className="relative flex gap-4">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                                            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">Processing</h3>
                                        <p className="text-sm text-muted-foreground">We're preparing your order</p>
                                    </div>
                                </div>

                                {/* Shipping */}
                                <div className="relative flex gap-4">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                                            <Truck className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-muted-foreground">Shipping</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Estimated delivery by {formattedDeliveryDate}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Shipping Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium flex items-center gap-2 mb-3">
                                <MapPin className="h-4 w-4" />
                                Shipping Address
                            </h3>
                            <address className="not-italic text-sm">
                                {order.shipping_address?.first_name} {order.shipping_address?.last_name}<br />
                                {order.shipping_address?.address_1}<br />
                                {order.shipping_address?.address_2 && (
                                    <>{order.shipping_address.address_2}<br /></>
                                )}
                                {order.shipping_address?.city}, {order.shipping_address?.province}{' '}
                                {order.shipping_address?.postal_code}<br />
                                {order.shipping_address?.country_code?.toUpperCase()}
                            </address>
                        </div>
                        <div>
                            <h3 className="font-medium mb-3">Order Details</h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <p className="text-muted-foreground">Order Number</p>
                                <p className="text-right">{order.display_id}</p>

                                <p className="text-muted-foreground">Date</p>
                                <p className="text-right">{formattedDate}</p>

                                <p className="text-muted-foreground">Payment Method</p>
                                <p className="text-right capitalize">
                                    {order.payments?.[0]?.provider_id?.replace(/_/g, ' ') || 'Credit card'}
                                </p>

                                <p className="text-muted-foreground">Shipping Method</p>
                                <p className="text-right">
                                    {order.shipping_methods?.[0]?.shipping_option?.name || 'Standard Shipping'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Order Items</h3>
                        <div className="space-y-4">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                    <div className="relative h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                        {item.thumbnail && (
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.title}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.title}</p>
                                        {item.variant?.options && (
                                            <p className="text-xs text-muted-foreground">
                                                {item.variant.options.map(option => option.value).join(' / ')}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium whitespace-nowrap">
                                        {currency_code} {(item.unit_price / 100).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{currency_code} {(order.subtotal / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>{currency_code} {(order.shipping_total / 100).toFixed(2)}</span>
                        </div>
                        {order.discount_total > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="text-green-600">-{currency_code} {(order.discount_total / 100).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t">
                            <span className="text-muted-foreground font-medium">Total</span>
                            <span className="font-semibold">
                                {currency_code} {(order.total / 100).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </CardContent>

                {/* Card Footer with Actions */}
                <CardFooter className="bg-muted/50 px-6 py-4 flex flex-col sm:flex-row justify-between gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/products" className="w-full sm:w-auto">
                            Continue Shopping
                        </Link>
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" asChild>
                            <Link href={`/account/orders/${order.id}`} className="flex items-center gap-1">
                                View Order Details <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/account/orders" className="flex items-center gap-1">
                                View All Orders
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Help Section */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>Need help? <Link href="/contact" className="text-primary underline">Contact us</Link></p>
                <p className="mt-1">We're here to help with any questions about your order.</p>
            </div>
        </div>
    );
}