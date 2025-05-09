"use client"

import {
    useState, useEffect, useMemo
} from "react"
import { HttpTypes } from "@medusajs/types"
import { useRegion } from "@/providers/region"
import { useCart } from "@/providers/cart"
import { useRouter } from "next/navigation"
import { sdk } from "@/lib/sdk"
import { formatPrice } from "@/lib/price"
import { CustomCard } from "@/components/CustomCard"
import { DotLoader } from "react-spinners"
import { Button } from "../ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"

type ProductProps = {
    handle: string
    isActive: boolean
}

export const Product = ({ handle, isActive }: ProductProps) => {
    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState<HttpTypes.StoreProduct>()
    const [selectedOptions, setSelectedOptions] = useState<
        Record<string, string>
    >({})
    const [quantity, setQuantity] = useState(1)
    const { region } = useRegion()
    const { cart, addToCart } = useCart()
    const router = useRouter()

    useEffect(() => {
        if (product || !region) {
            return
        }
        // so basically at this point we are fetching only a specific product by sending the handl
        // additionlly, we are also fetching only calculated price and inventory quantity
        sdk.store.product.list({
            handle,
            region_id: region.id,
            fields: `*variants.calculated_price,+variants.inventory_quantity`,
        })
            .then(({ products }) => {
                if (products.length) {
                    setProduct(products[0])
                }
                setLoading(false)
            })
    }, [product, region])


    // We create a selectedVariant memoized variable that holds the selected variant based on the selected options. You find the selected variant by filtering the product's variants to find the one that matches all the selected options.
    const selectedVariant = useMemo(() => {
        if (
            !product?.variants ||
            !product.options ||
            Object.keys(selectedOptions).length !== product.options?.length
        ) {
            return
        }

        return product.variants.find((variant) => variant.options?.every(
            (optionValue) => optionValue.id === selectedOptions[optionValue.option_id!]
        ))
    }, [selectedOptions, product])

    const price = useMemo(() => {
        const selectedVariantPrice = selectedVariant ||
            product?.variants?.sort((a: HttpTypes.StoreProductVariant, b: HttpTypes.StoreProductVariant) => {
                if (!a.calculated_price?.calculated_amount && !b.calculated_price?.calculated_amount) {
                    return 0
                }
                if (!a.calculated_price?.calculated_amount) {
                    return 1
                }
                if (!b.calculated_price?.calculated_amount) {
                    return -1
                }
                return (
                    a.calculated_price?.calculated_amount -
                    b.calculated_price?.calculated_amount
                )
            })[0]

        return formatPrice(
            selectedVariantPrice?.calculated_price?.calculated_amount || 0,
            region?.currency_code
        )
    }, [selectedVariant, product, region])

    const isInStock = useMemo(() => {
        if (!selectedVariant) {
            return undefined
        }

        return selectedVariant.manage_inventory === false ||
            (selectedVariant.inventory_quantity || 0) > 0
    }, [selectedVariant])

    const handleAddToCart = () => {
        if (!selectedVariant || !isInStock || !quantity) {
            return
        }
        setLoading(true)

        addToCart(selectedVariant.id!, quantity)
            .then(() => {
                router.push(`/${handle}?step=address`)
            })
    }

    return (
        <CustomCard
            title="Product"
            isActive={isActive}
            isDone={cart?.items !== undefined && cart?.items?.length > 0}
            path={`/${handle}`}
        >
            {loading &&
                <div className="flex flex-col items-center justify-center">
                    <DotLoader size={24} color="#9333ea" />
                </div>
            }
            {!loading && !product && <div>Product not found</div>}
            {!loading && product && (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <img
                            src={product.thumbnail || ""}
                            className="rounded"
                            width={160}
                            height={200}
                            alt={product.title}
                        />
                        <div className="flex flex-col gap-1">
                            {product.categories?.length && (
                                <span className="text-xs text-muted-foreground">
                                    {product.categories[0].name}
                                </span>
                            )}
                            <span className="text-base font-medium">
                                {product.title}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {price}
                            </span>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {product.description}
                    </p>
                    {product.options?.map((option) => (
                        <div className="flex flex-col gap-1" key={option.id}>
                            <span className="text-xs text-muted-foreground">
                                {option.title}
                            </span>
                            <Select
                                onValueChange={(value) => {
                                    setSelectedOptions((prev) => ({
                                        ...prev,
                                        [option.id!]: value,
                                    }))
                                }}
                                value={selectedOptions[option.id!]}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={`Select ${option.title}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {option.values?.map((value) => (
                                        <SelectItem
                                            key={value.id}
                                            value={value.id}
                                        >
                                            {value.value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">
                            Quantity
                        </span>
                        <Input
                            name="quantity"
                            placeholder="Quantity"
                            type="number"
                            min="1"
                            max={selectedVariant?.inventory_quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <Separator className="my-1" />
                    <Button
                        disabled={!selectedVariant || !isInStock || loading}
                        onClick={handleAddToCart}
                        className="w-full"
                        variant="default"
                    >
                        {!selectedVariant && "Select Options"}
                        {selectedVariant && !isInStock && "Out of Stock"}
                        {selectedVariant && isInStock && "Add to Cart"}
                    </Button>
                </div>
            )}
        </CustomCard>
    )

}