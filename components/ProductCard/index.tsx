import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

// Types
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    discountedPrice?: number;
    imageUrl: string;
    category: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    currencyCode?: string;
    formattedPrice?: string;
    formattedDiscountedPrice?: string;
}

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onAddToWishlist?: (product: Product) => void;
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

    const discount = (product.discountedPrice && product.price > 0)
        ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        : 0;

    const renderStars = () => {
        return Array(5).fill(0).map((_, i) => {
            const starClass = i < Math.floor(product.rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300";
            return <Star key={i} size={14} className={starClass} />;
        });
    };

    const hasPricing = product.price > 0;
    const showDiscounted = product.discountedPrice && product.discountedPrice < product.price;

    return (
        <Card
            className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-md flex flex-col relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Discount Banner */}
            {discount > 0 && (
                <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center text-xs font-bold py-1 z-10">
                    {discount}% OFF
                </div>
            )}

            {/* Image */}
            <div className="relative aspect-square overflow-hidden" style={{ marginTop: discount > 0 ? '24px' : '0' }}>
                {/* Product Image */}
                <img
                    src={product.imageUrl || "/api/placeholder/400/400"}
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
                                    src={product.imageUrl || "/api/placeholder/400/400"}
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
                                        ({product.reviewCount} reviews)
                                    </span>
                                </div>

                                {hasPricing ? (
                                    <div className="flex items-center gap-2">
                                        {showDiscounted ? (
                                            <>
                                                <span className="text-lg font-bold text-red-600">
                                                    {product.formattedDiscountedPrice ||
                                                        `${product.currencyCode} ${product.discountedPrice?.toFixed(2)}`}
                                                </span>
                                                <span className="text-gray-500 text-sm line-through">
                                                    {product.formattedPrice ||
                                                        `${product.currencyCode} ${product.price.toFixed(2)}`}
                                                </span>
                                                <Badge className="bg-red-600 hover:bg-red-700">
                                                    {discount}% OFF
                                                </Badge>
                                            </>
                                        ) : (
                                            <span className="text-lg font-bold">
                                                {product.formattedPrice ||
                                                    `${product.currencyCode} ${product.price.toFixed(2)}`}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-600">Contact for price</span>
                                )}

                                <p className="text-sm text-gray-700 line-clamp-4">
                                    {product.description}
                                </p>

                                <div className="mt-auto flex gap-2">
                                    <Button
                                        className="flex-1"
                                        onClick={handleAddToCart}
                                        disabled={!product.inStock || isLoading}
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
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                {hasPricing ? (
                    <div className="flex items-center gap-1">
                        {showDiscounted ? (
                            <>
                                <span className="font-bold text-sm text-red-600">
                                    {product.formattedDiscountedPrice ||
                                        `${product.currencyCode} ${product.discountedPrice?.toFixed(2)}`}
                                </span>
                                <span className="text-gray-500 text-xs line-through">
                                    {product.formattedPrice ||
                                        `${product.currencyCode} ${product.price.toFixed(2)}`}
                                </span>
                            </>
                        ) : (
                            <span className="font-bold text-sm">
                                {product.formattedPrice ||
                                    `${product.currencyCode} ${product.price.toFixed(2)}`}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-gray-600">Contact for price</span>
                )}

                <div className="mt-1">
                    <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="p-3 pt-0">
                <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isLoading}
                >
                    <ShoppingCart size={14} />
                    {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;