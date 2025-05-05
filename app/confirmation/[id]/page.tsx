import { sdk } from "@/lib/sdk"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type Params = {
    params: Promise<{ id: string }>
}

export default async function ConfirmationPage({
    params,
}: Params) {
    const orderId = (await params).id
    const { order } = await sdk.store.order.retrieve(orderId)

    return (
        <Card className={cn(
            "w-full",
            "shadow-sm"
        )}>
            <CardContent className="flex flex-col gap-4 py-4">
                <h2 className="text-2xl font-semibold">Thank you, {order.shipping_address?.first_name}!</h2>
                <p className="text-muted-foreground">Your order has been placed. We are working to get it settled.</p>

                <Separator className="my-1" />

                <div className="flex flex-col gap-2">
                    <span className="flex gap-1">
                        <span className="text-sm text-muted-foreground">Order number:</span>
                        <span className="text-sm font-medium">{order.display_id}</span>
                    </span>
                    <span className="flex gap-1">
                        <span className="text-sm text-muted-foreground">Order date:</span>
                        <span className="text-sm font-medium">{
                            order.created_at.toString()
                        }</span>
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}