// components/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

const backgroundImages = [
    "https://plus.unsplash.com/premium_photo-1661497908961-e9e04ae0a027?q=80&w=1952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with your actual image URLs
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661430931607-70b2e194f741?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];
// components/HeroSection.tsx


export default function HeroSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Background Images */}
            {backgroundImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
                </div>
            ))}

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
                <div className="max-w-3xl mt-20 md:mt-0 animate-float">
                    <span className="inline-block px-4 py-2 rounded-full bg-[var(--chart-1)]/10 text-[var(--chart-1)] font-medium text-sm mb-4">
                        New Collection Available
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                        <span className="snuggle-gradient-text">Comfort & Style</span>
                        <br />
                        for Your Little Ones
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl text-muted-foreground">
                        Discover our premium range of soft, sustainable baby clothes and accessories
                        that bring comfort, style, and joy to your baby&apos;s everyday adventures.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            // label="Shop Now"
                            className="snuggle-button text-base px-8 py-6 cursor-pointer">
                            <ArrowRight className="ml-2 h-4 w-4" /> Shop Now
                        </Button>
                    </div>
                </div>

                {/* Image indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {backgroundImages.map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 rounded-full transition-all ${index === currentImageIndex ? "w-8 bg-[var(--chart-1)]" : "w-2 bg-muted"
                                }`}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom cards */}
            <div className="absolute bottom-0 left-0 right-0 z-10 hidden lg:block">
                <div className="container mx-auto px-4 pb-8">
                    <div className="grid grid-cols-3 gap-6">
                        {["Free Shipping", "100% Organic", "Easy Returns"].map((feature, index) => (
                            <div key={index} className="snuggle-card p-4 flex items-center justify-center">
                                <span className="font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}