import React from 'react';
import { ShoppingCart } from 'lucide-react';
import ProductCard from '../ProductCard';
import { Product } from '../ProductCard';

interface ProductGridProps {
    products: Product[];
    isLoading?: boolean;
    onAddToCart?: (product: Product) => void;
    onAddToWishlist?: (product: Product) => void;
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
                <div
                    key={product.id}
                    className="transition-all duration-300 animate-fadeIn"
                >
                    <ProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                        onAddToWishlist={onAddToWishlist}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;