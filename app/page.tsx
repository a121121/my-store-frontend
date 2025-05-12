// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import HeroSection from "@/components/Hero";
import ProductPage from "@/components/ProductsPage";
import { useRegion } from "@/providers/region";
import { HttpTypes } from "@medusajs/types";
import { listProducts } from "@/lib/products";
import { adaptMedusaProduct } from "@/lib/product-adapter";

export default function Home() {
  const { region } = useRegion();
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
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
            fields: "title,description,images.url,images.metadata,handle,variants.calculated_price,variants.inventory_quantity",
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

  const handleAddToCart = (product: { title: string }) => {
    setCartCount(prev => prev + 1);
    console.log('Adding to cart:', product.title);
  };

  const handleAddToWishlist = (product: { title: string }) => {
    setWishlistCount(prev => prev + 1);
    console.log('Adding to wishlist:', product.title);
  };

  const adaptedProducts = products.map(product => adaptMedusaProduct(product));

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProductPage
        products={adaptedProducts}
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