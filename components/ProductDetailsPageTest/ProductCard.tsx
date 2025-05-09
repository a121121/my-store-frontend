import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

// Types based on your actual API response
export interface ProductOption {
    id: string;
    title: string;
    values: {
        id: string;
        value: string;
    }[];
}

export interface ProductVariant {
    id: string;
    title: string;
    sku: string;
    prices?: {
        amount: number;
        currency_code: string;
    }[];
    inventory_quantity?: number;
}

export interface ProductImage {
    id: string;
    url: string;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    handle: string;
    thumbnail: string;
    collection?: {
        id: string;
        title: string;
        handle: string;
    };
    options: ProductOption[];
    variants: ProductVariant[];
    images: ProductImage[];
}

interface ProductCardProps {
    product: Product;
    prices?: {
        [variantId: string]: {
            price: number;
            originalPrice?: number;
        };
    };
    inventoryStatus?: {
        [variantId: string]: number;
    };
    onAddToCart?: (product: Product, variantId: string) => void;
    onAddToWishlist?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    prices = {},
    inventoryStatus = {},
    onAddToCart,
    onAddToWishlist,
    onQuickView
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Default to first variant
    const defaultVariant = product.variants[0]?.id;
    const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

    // Get price information for the selected variant
    const priceInfo = selectedVariant && prices[selectedVariant]
        ? prices[selectedVariant]
        : { price: 0 };

    // Calculate discount percentage if there's an original price
    const discount = priceInfo.originalPrice
        ? Math.round(((priceInfo.originalPrice - priceInfo.price) / priceInfo.originalPrice) * 100)
        : 0;

    // Check if product is in stock
    const inStock = selectedVariant &&
        (inventoryStatus[selectedVariant] === undefined || inventoryStatus[selectedVariant] > 0);

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            if (onAddToCart) onAddToCart(product, selectedVariant);
            setIsLoading(false);
        }, 500);
    };

    // Get product category (collection title)
    const category = product.collection?.title || '';

    // Determine main image URL
    const imageUrl = product.thumbnail || product.images[0]?.url || "/api/placeholder/400/400";

    return (
        <Card
            className="overflow-hidden transition-all duration-300 h-full flex flex-col hover:shadow-lg"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Product Image Container */}
            <div className="relative pt-[100%] w-full overflow-hidden bg-gray-100">
                {/* Sale Badge */}
                {discount > 0 && (
                    <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">
                        -{discount}%
                    </Badge>
                )}

                {/* Category Badge */}
                {category && (
                    <Badge className="absolute top-2 right-2 z-10 bg-blue-500 hover:bg-blue-600">
                        {category}
                    </Badge>
                )}

                {/* Product Image */}
                <img
                    src={imageUrl}
                    alt={product.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}
                />

                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-full"
                                onClick={() => onQuickView && onQuickView(product)}
                            >
                                <Eye size={18} />
                            </Button>
                        </DialogTrigger>
                    </Dialog>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col gap-2 flex-grow">
                <h3 className="font-medium text-lg line-clamp-2 h-14">{product.title}</h3>

                <div className="flex items-center gap-2 mt-1">
                    {priceInfo.originalPrice ? (
                        <>
                            <span className="font-bold">${priceInfo.price.toFixed(2)}</span>
                            <span className="text-gray-500 text-sm line-through">${priceInfo.originalPrice.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="font-bold">${priceInfo.price.toFixed(2)}</span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="mt-1">
                    {inStock ? (
                        <span className="text-xs text-green-600 font-medium">In Stock</span>
                    ) : (
                        <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                    )}
                </div>
            </div>

            {/* Product Actions */}
            <div className="p-4 pt-0 mt-auto">
                <div className="flex gap-2">
                    <Button
                        className="flex-1 gap-2"
                        onClick={handleAddToCart}
                        disabled={!inStock || isLoading}
                    >
                        <ShoppingCart size={16} />
                        {isLoading ? "Adding..." : "Add to Cart"}
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onAddToWishlist && onAddToWishlist(product)}
                    >
                        <Heart size={16} />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;