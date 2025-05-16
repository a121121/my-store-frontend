import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@/lib/get-product-price";

interface ProductCardProps {
    product: HttpTypes.StoreProduct;
    onAddToCart?: (product: HttpTypes.StoreProduct) => void;
    onAddToWishlist?: (product: HttpTypes.StoreProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    onAddToWishlist
}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (onAddToCart) onAddToCart(product);
            setIsLoading(false);
        }, 500);
    };

    // Get price info directly from Medusa product
    const priceData = getProductPrice({ product });
    const cheapestPrice = priceData.cheapestPrice;

    const price = cheapestPrice?.calculated_price_number ? cheapestPrice.calculated_price_number / 100 : 0;
    const originalPrice = cheapestPrice?.original_price_number ? cheapestPrice.original_price_number / 100 : undefined;
    const hasDiscount = originalPrice && originalPrice > price;

    const discount = hasDiscount && price > 0
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;


    const renderStars = () => {
        // Default rating since Medusa doesn't provide this
        const rating = 5;
        return Array(5).fill(0).map((_, i) => {
            const starClass = i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300";
            return <Star key={i} size={14} className={starClass} />;
        });
    };

    const hasPricing = price > 0;
    const imageUrl = product.images?.[0]?.url || "/api/placeholder/400/400";

    // Inventory check
    const inStock = product.variants?.some(variant =>
        variant.inventory_quantity === undefined || variant.inventory_quantity > 0
    ) ?? true;

    return (
        <Card
            className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Discount Banner */}
            {hasDiscount && discount > 0 && (
                <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center text-xs font-bold py-1 z-10">
                    {discount}% OFF
                </div>
            )}

            {/* Image */}
            <div className="relative aspect-square overflow-hidden" style={{ marginTop: hasDiscount ? '24px' : '0' }}>
                {/* Product Image */}
                <img
                    src={imageUrl}
                    alt={product.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isHovering ? 'scale-105' : 'scale-100'}`}
                />

                {/* Quick View Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            variant="secondary"
                            className={`absolute bottom-2 right-2 rounded-full transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <Eye size={16} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl p-0 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="aspect-square bg-gray-100">
                                <img
                                    src={imageUrl}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <div>
                                    <h2 className="text-xl font-bold">{product.title}</h2>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex">{renderStars()}</div>
                                    <span className="text-xs text-gray-500">
                                        (0 reviews) {/* Medusa doesn't provide review count */}
                                    </span>
                                </div>

                                {hasPricing ? (
                                    <div className="flex items-center gap-2">
                                        {hasDiscount ? (
                                            <>
                                                <span className="text-lg font-bold text-red-600">
                                                    {cheapestPrice?.calculated_price || `$${price.toFixed(2)}`}
                                                </span>
                                                <span className="text-gray-500 text-sm line-through">
                                                    {cheapestPrice?.original_price || `$${originalPrice?.toFixed(2)}`}
                                                </span>
                                                <Badge className="bg-red-600 hover:bg-red-700">
                                                    {discount}% OFF
                                                </Badge>
                                            </>
                                        ) : (
                                            <span className="text-lg font-bold">
                                                {cheapestPrice?.calculated_price || `$${price.toFixed(2)}`}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-600">Contact for price</span>
                                )}

                                <p className="text-sm text-gray-700 line-clamp-4">
                                    {product.description || "No description available"}
                                </p>

                                <div className="mt-auto flex gap-2">
                                    <Button
                                        className="flex-1"
                                        onClick={handleAddToCart}
                                        disabled={!inStock || isLoading}
                                    >
                                        {isLoading ? "Adding..." : "Add to Cart"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => onAddToWishlist?.(product)}
                                    >
                                        <Heart size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Product Info */}
            <div className="p-3 flex flex-col gap-1 flex-grow">
                <h3 className="font-medium text-sm line-clamp-2">{product.title}</h3>

                <div className="flex items-center gap-1">
                    <div className="flex">{renderStars()}</div>
                    <span className="text-xs text-gray-500">(0)</span>
                </div>

                {hasPricing ? (
                    <div className="flex items-center gap-1">
                        {hasDiscount ? (
                            <>
                                <span className="font-bold text-sm text-red-600">
                                    {cheapestPrice?.calculated_price || `$${price.toFixed(2)}`}
                                </span>
                                <span className="text-gray-500 text-xs line-through">
                                    {cheapestPrice?.original_price || `$${originalPrice?.toFixed(2)}`}
                                </span>
                            </>
                        ) : (
                            <span className="font-bold text-sm">
                                {cheapestPrice?.calculated_price || `$${price.toFixed(2)}`}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-gray-600">Contact for price</span>
                )}

                <div className="mt-1">
                    <span className={`text-xs font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="p-3 pt-0">
                <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleAddToCart}
                    disabled={!inStock || isLoading}
                >
                    <ShoppingCart size={14} />
                    {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;