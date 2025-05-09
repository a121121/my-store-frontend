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
        // Simulate API call
        setTimeout(() => {
            if (onAddToCart) onAddToCart(product);
            setIsLoading(false);
        }, 500);
    };

    const discount = product.discountedPrice
        ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
        : 0;

    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className="relative">
                        <Star size={16} className="text-gray-300" />
                        <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} size={16} className="text-gray-300" />);
            }
        }
        return stars;
    };

    return (
        <Card
            className="overflow-hidden transition-all duration-300 h-full flex flex-col hover:shadow-lg"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Product Image Container */}
            <div className="relative pt-[100%] w-full overflow-hidden bg-gray-100">
                {/* Sale Badge */}
                {product.discountedPrice && (
                    <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">
                        -{discount}%
                    </Badge>
                )}

                {/* Category Badge */}
                <Badge className="absolute top-2 right-2 z-10 bg-blue-500 hover:bg-blue-600">
                    {product.category}
                </Badge>

                {/* Product Image */}
                <img
                    src={product.imageUrl || "/api/placeholder/400/400"}
                    alt={product.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}
                />

                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" className="rounded-full">
                                <Eye size={18} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="aspect-square overflow-hidden rounded-md">
                                    <img
                                        src={product.imageUrl || "/api/placeholder/400/400"}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold">{product.title}</h2>
                                        <p className="text-gray-500">{product.category}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex">{renderStars()}</div>
                                        <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {product.discountedPrice ? (
                                            <>
                                                <span className="text-xl font-bold">${product.discountedPrice.toFixed(2)}</span>
                                                <span className="text-gray-500 line-through">${product.price.toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                                        )}
                                    </div>

                                    <p className="text-gray-700">{product.description}</p>

                                    <div className="mt-auto flex gap-2">
                                        <Button className="flex-1" onClick={handleAddToCart} disabled={!product.inStock || isLoading}>
                                            {isLoading ? "Adding..." : "Add to Cart"}
                                        </Button>
                                        <Button variant="outline" onClick={() => onAddToWishlist && onAddToWishlist(product)}>
                                            <Heart size={20} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col gap-2 flex-grow">
                <h3 className="font-medium text-lg line-clamp-2 h-14">{product.title}</h3>

                <div className="flex items-center gap-1">
                    <div className="flex">{renderStars()}</div>
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    {product.discountedPrice ? (
                        <>
                            <span className="font-bold">${product.discountedPrice.toFixed(2)}</span>
                            <span className="text-gray-500 text-sm line-through">${product.price.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="mt-1">
                    {product.inStock ? (
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
                        disabled={!product.inStock || isLoading}
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