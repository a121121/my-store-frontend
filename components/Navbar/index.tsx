// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegion } from "@/providers/region";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Navbar() {
    const { region, regions, setRegion } = useRegion()
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "py-2 glossy-effect" : "py-4 bg-transparent"
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Mobile menu button - only visible on mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    {/* Logo - aligned left on desktop */}
                    <div className="flex items-center md:flex-grow-0">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold snuggle-gradient-text">
                                SnugleeBaby
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - centered */}
                    <nav className="hidden md:flex items-center justify-center flex-grow">
                        <ul className={`flex space-x-1 ${isScrolled ? "" : "glossy-effect"} rounded-full px-4 py-2`}>
                            {["Home", "Shop", "Collections", "About", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={"/"}
                                        className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Icons - aligned right */}
                    <div className="hidden md:flex items-center space-x-2">
                        {/* <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                        </Button> */}
                        <Select
                            value={region?.id}
                            onValueChange={(value) => {
                                const selectedRegion = regions.find(
                                    (r) => r.id === value
                                )
                                setRegion(selectedRegion)
                            }}
                        >
                            <SelectTrigger className="w-auto h-8 text-sm">
                                <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                                {regions.map((r) => (
                                    <SelectItem key={r.id} value={r.id}>
                                        {r.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[var(--chart-1)] text-xs flex items-center justify-center text-white">
                                3
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 md:hidden">
                    <div className="flex flex-col h-full p-8">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-2xl font-bold snuggle-gradient-text">
                                SnuggleeBaby
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <nav className="flex-1">
                            <ul className="space-y-6 text-center">
                                {["Home", "Shop", "Collections", "About", "Contact"].map((item) => (
                                    <li key={item}>
                                        <Link
                                            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                            className="text-xl font-medium"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="mt-auto pt-8 border-t border-border">
                            <div className="flex justify-center space-x-4">
                                <Select
                                    value={region?.id}
                                    onValueChange={(value) => {
                                        const selectedRegion = regions.find(
                                            (r) => r.id === value
                                        )
                                        setRegion(selectedRegion)
                                    }}
                                >
                                    <SelectTrigger className="w-auto h-8 text-sm">
                                        <SelectValue placeholder="Select region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map((r) => (
                                            <SelectItem key={r.id} value={r.id}>
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>Account</span>
                                </Button>
                                <Button className="snuggle-button flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4" />
                                    <span>Cart (3)</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}