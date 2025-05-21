import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Heart, ShoppingCart, Star, Eye, ArrowRight } from 'lucide-react';
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@/lib/get-product-price";

interface ProductCardProps {
    product: HttpTypes.StoreProduct;
    onAddToCart?: (product: HttpTypes.StoreProduct) => void;
    onAddToWishlist?: (product: HttpTypes.StoreProduct) => void;
    onViewProductDetails?: (product: HttpTypes.StoreProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
    onAddToWishlist,
    onViewProductDetails
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

    const handleViewProductDetails = () => {
        console.log("Navigating to product details page for:", product.title, "Product ID:", product.id);
        if (onViewProductDetails) onViewProductDetails(product);
    };

    // Get price info
    const priceData = getProductPrice({ product });
    const cheapestPrice = priceData.cheapestPrice;
    const price = cheapestPrice?.calculated_price_number ? cheapestPrice.calculated_price_number / 100 : 0;
    const originalPrice = cheapestPrice?.original_price_number ? cheapestPrice.original_price_number / 100 : undefined;
    const hasDiscount = originalPrice && originalPrice > price;
    const discount = hasDiscount && price > 0
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const hasMultipleVariants = product.variants && product.variants.length > 1;
    const hasPricing = price > 0;
    const imageUrl = product.images?.[0]?.url || "/api/placeholder/400/400";
    const inStock = product.variants?.some(variant =>
        variant.inventory_quantity === undefined || variant.inventory_quantity > 0
    ) ?? true;

    const renderStars = () => {
        const rating = 5;
        return Array(5).fill(0).map((_, i) => {
            const starClass = i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300";
            return <Star key={i} size={14} className={starClass} />;
        });
    };

    return (
        <div
            className="group relative flex flex-col h-full rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg bg-white"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Discount Banner */}
            {hasDiscount && discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    {discount}% OFF
                </div>
            )}

            {/* Wishlist Button */}
            <button
                onClick={() => onAddToWishlist?.(product)}
                className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
                <Heart size={18} className="text-gray-700 hover:fill-red-500 hover:text-red-500" />
            </button>

            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}
                />

                {/* Quick View Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            variant="secondary"
                            className={`absolute bottom-2 right-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                        >
                            <Eye size={16} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-lg">
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
                                        (0 reviews)
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
                                    {hasMultipleVariants ? (
                                        <Button
                                            className="flex-1"
                                            onClick={handleViewProductDetails}
                                            disabled={!inStock}
                                        >
                                            View Options
                                        </Button>
                                    ) : (
                                        <Button
                                            className="flex-1"
                                            onClick={handleAddToCart}
                                            disabled={!inStock || isLoading}
                                        >
                                            {isLoading ? "Adding..." : "Add to Cart"}
                                        </Button>
                                    )}
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
            <div className="p-4 flex flex-col gap-2 flex-grow">
                <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                    {product.title}
                </h3>

                <div className="flex items-center gap-1">
                    <div className="flex">{renderStars()}</div>
                    <span className="text-xs text-gray-500">(0)</span>
                </div>

                {hasPricing ? (
                    <div className="flex items-center gap-2 mt-1">
                        {hasDiscount ? (
                            <>
                                <span className="font-bold text-base text-red-600">
                                    {cheapestPrice?.calculated_price || `$${price.toFixed(2)}`}
                                </span>
                                <span className="text-gray-500 text-sm line-through">
                                    {cheapestPrice?.original_price || `$${originalPrice?.toFixed(2)}`}
                                </span>
                            </>
                        ) : (
                            <span className="font-bold text-base">
                                {cheapestPrice?.calculated_price || `$${price.toFixed(2)}`}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-sm text-gray-600 mt-1">Contact for price</span>
                )}

                <div className="mt-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-4 pb-4">
                {hasMultipleVariants ? (
                    <Button
                        size="sm"
                        className="w-full gap-2 hover:bg-primary/90 transition-colors"
                        onClick={handleViewProductDetails}
                        disabled={!inStock}
                        variant="default"
                    >
                        View Options <ArrowRight size={14} />
                    </Button>
                ) : (
                    <Button
                        size="sm"
                        className="w-full gap-2 hover:bg-primary/90 transition-colors"
                        onClick={handleAddToCart}
                        disabled={!inStock || isLoading}
                    >
                        <ShoppingCart size={14} />
                        {isLoading ? "Adding..." : "Add to Cart"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;