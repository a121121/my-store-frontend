"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/Hero";
import ProductPage from "@/components/ProductsPage";
import { useRegion } from "@/providers/region";
import { HttpTypes } from "@medusajs/types";
import { listProducts } from "@/lib/products";
import { useCart } from "@/providers/cart";

export default function Home() {
  const { cart, addToCart, refreshCart } = useCart();
  const { region } = useRegion();
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    async function fetchAllProducts() {
      if (!region) return;

      try {
        setIsLoading(true);
        setError(null);

        const productsResponse = await listProducts({
          regionId: region.id,
          queryParams: {
            fields: "id,title,description,handle,images.url,images.metadata,variants.id,variants.title,variants.sku,variants.calculated_price,variants.inventory_quantity",
            limit: 12
          },
        });

        setProducts(productsResponse.response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllProducts();
  }, [region]);

  const handleAddToCart = async (product: HttpTypes.StoreProduct) => {
    try {
      if (!product.variants || product.variants.length === 0) {
        throw new Error("No variants available for this product");
      }

      const variantId = product.variants[0].id;
      if (!variantId) {
        throw new Error("Variant ID is missing");
      }

      await addToCart(variantId, 1);
      console.log("Added to cart:", product.title);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = (product: HttpTypes.StoreProduct) => {
    setWishlistCount(prev => prev + 1);
    console.log("Adding to wishlist:", product.title);
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProductPage
        products={products} // Pass raw products directly
        isLoading={isLoading}
        error={error}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
    </main>
  );
}