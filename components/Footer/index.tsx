"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-muted text-muted-foreground mt-20 border-t border-border">
            <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
                {/* Branding and Newsletter */}
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                        SnugleeBaby
                    </h2>
                    <p className="mb-4 text-sm">
                        Adorable products for your little ones, made with love and care.
                    </p>
                    <form className="flex items-center space-x-2">
                        <Input
                            type="email"
                            placeholder="Your email"
                            className="rounded-full h-9"
                        />
                        <Button className="rounded-full h-9 text-xs px-4">Subscribe</Button>
                    </form>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-md font-semibold text-foreground mb-4">
                        Quick Links
                    </h3>
                    <ul className="space-y-2 text-sm">
                        {["Home", "Shop", "Collections", "About", "Contact"].map((item) => (
                            <li key={item}>
                                <Link
                                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                    className="hover:underline"
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact & Socials */}
                <div>
                    <h3 className="text-md font-semibold text-foreground mb-4">
                        Contact Us
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Phone className="h-4 w-4" /> +1 (800) 123-4567
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="h-4 w-4" /> support@snugleebaby.com
                        </li>
                    </ul>
                    <div className="flex gap-4 mt-4">
                        <Link href="https://facebook.com" target="_blank">
                            <Facebook className="h-5 w-5 hover:text-foreground" />
                        </Link>
                        <Link href="https://instagram.com" target="_blank">
                            <Instagram className="h-5 w-5 hover:text-foreground" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="text-center text-xs py-4 border-t border-border">
                &copy; {new Date().getFullYear()} SnugleeBaby. All rights reserved.
            </div>
        </footer>
    );
}
