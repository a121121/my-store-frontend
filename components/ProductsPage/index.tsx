// components/ProductsPage/index.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductGrid from '../ProductGrid';
import { Product } from '../ProductCard';

interface ProductPageProps {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    cartCount: number;
    wishlistCount: number;
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (product: Product) => void;
}

export default function ProductPage({
    products,
    isLoading,
    error,
    cartCount,
    wishlistCount,
    onAddToCart,
    onAddToWishlist,
}: ProductPageProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Featured Products</h1>
                <div className="flex gap-4">
                    <Button variant="outline" className="gap-2">
                        <Heart size={20} />
                        <span className="font-medium">{wishlistCount}</span>
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <ShoppingCart size={20} />
                        <span className="font-medium">{cartCount}</span>
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    Loading products...
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <ProductGrid
                    products={products}
                    onAddToCart={onAddToCart}
                    onAddToWishlist={onAddToWishlist}
                />
            )}
        </div>
    );
}