'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import ProductGrid from '../ProductGrid';
import { Product } from '../ProductCard';

export default function ProductPage() {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    const demoProducts: Product[] = [
        {
            id: "1",
            title: "Premium Wireless Noise-Cancelling Headphones",
            description: "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
            price: 299.99,
            discountedPrice: 249.99,
            imageUrl: "/randomImage.webp",
            category: "Audio",
            rating: 4.7,
            reviewCount: 128,
            inStock: true
        },
        {
            id: "2",
            title: "Ergonomic Office Chair with Lumbar Support",
            description: "Stay comfortable during long work hours with this ergonomic office chair featuring adjustable height, breathable mesh back, and enhanced lumbar support.",
            price: 189.99,
            imageUrl: "/api/placeholder/400/400",
            category: "Furniture",
            rating: 4.3,
            reviewCount: 75,
            inStock: true
        },
        {
            id: "3",
            title: "Smart Fitness Watch with Heart Rate Monitor",
            description: "Track your fitness goals with this waterproof smart watch featuring heart rate monitoring, sleep tracking, and 7-day battery life.",
            price: 149.99,
            discountedPrice: 119.99,
            imageUrl: "/api/placeholder/400/400",
            category: "Wearables",
            rating: 4.5,
            reviewCount: 212,
            inStock: false
        },
        {
            id: "4",
            title: "Professional DSLR Camera with 4K Video Recording",
            description: "Capture stunning photos and videos with this professional-grade DSLR camera featuring 24.2MP sensor, 4K video recording, and interchangeable lenses.",
            price: 1299.99,
            imageUrl: "/api/placeholder/400/400",
            category: "Photography",
            rating: 4.9,
            reviewCount: 64,
            inStock: true
        },
        {
            id: "5",
            title: "Ceramic Non-Stick Cookware Set (10-Piece)",
            description: "Upgrade your kitchen with this premium 10-piece cookware set featuring ceramic non-stick coating, heat-resistant handles, and dishwasher-safe design.",
            price: 249.99,
            discountedPrice: 199.99,
            imageUrl: "/api/placeholder/400/400",
            category: "Kitchen",
            rating: 4.2,
            reviewCount: 93,
            inStock: true
        },
        {
            id: "6",
            title: "Portable Bluetooth Speaker with 360° Sound",
            description: "Enjoy immersive audio anywhere with this waterproof Bluetooth speaker featuring 360° sound, 16-hour battery life, and built-in microphone for calls.",
            price: 79.99,
            imageUrl: "/api/placeholder/400/400",
            category: "Audio",
            rating: 4.4,
            reviewCount: 157,
            inStock: true
        },
    ];

    const handleAddToCart = (product: Product) => {
        setCartCount(prev => prev + 1);
        console.log(`Added to cart: ${product.title}`);
    };

    const handleAddToWishlist = (product: Product) => {
        setWishlistCount(prev => prev + 1);
        console.log(`Added to wishlist: ${product.title}`);
    };

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

            <ProductGrid
                products={demoProducts}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
            />
        </div>
    );
}