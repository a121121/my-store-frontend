import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { HttpTypes } from "@medusajs/types";
import Link from "next/link";
import ProductCard from '../ProductCard';

interface ProductGridProps {
    products: HttpTypes.StoreProduct[];
    isLoading?: boolean;
    onAddToCart?: (product: HttpTypes.StoreProduct) => void;
    onAddToWishlist?: (product: HttpTypes.StoreProduct) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    isLoading = false,
    onAddToCart,
    onAddToWishlist
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 aspect-square rounded-md"></div>
                        <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart size={48} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No products found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
                <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="transition-all duration-300 animate-fadeIn hover:shadow-lg rounded-lg"
                    passHref
                >
                    <ProductCard
                        product={product}
                        onAddToCart={(e) => {
                            // e.preventDefault();
                            // e.stopPropagation();
                            onAddToCart?.(product);
                        }}
                        onAddToWishlist={(e) => {
                            // e.preventDefault();
                            // e.stopPropagation();
                            onAddToWishlist?.(product);
                        }}
                    />
                </Link>
            ))}
        </div>
    );
};

export default ProductGrid;