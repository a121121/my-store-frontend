"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/Hero";
import ProductPage from "@/components/ProductsPage";
import { sdk } from "@/lib/sdk";
import { useRegion } from "@/providers/region";
import ProductDetailPage from "@/components/ProductDetailsPageTest";

// Define proper types for the API response
interface Product {
  id: string;
  title: string;
  // Add other product fields you need
  variants: any[];
  metadata: Record<string, any>;
  tags: any[];
}

interface ProductsResponse {
  products: Product[];
  count: number;
}


// Price and inventory data would typically come from a separate API call
// or would be included in the product data
interface ProductPrices {
  [variantId: string]: {
    price: number;
    originalPrice?: number;
  };
}

interface InventoryStatus {
  [variantId: string]: number;
}


export default function Home() {
  const { region } = useRegion();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Mock
  const [selectedProduct, setSelectedProduct] = useState();
  // Mock price data - in a real app this would come from your API
  const [prices, setPrices] = useState<{ [productId: string]: ProductPrices }>({});
  const [inventory, setInventory] = useState<{ [productId: string]: InventoryStatus }>({});



  useEffect(() => {
    async function fetchAllProducts() {
      if (!region) return;

      try {
        setIsLoading(true);

        // Fetch products with proper region context
        const response = await sdk.client.fetch<ProductsResponse>(
          `/store/products`,
          {
            method: "GET",
            query: {
              limit: 10, // Adjust as needed
              offset: 0, // For first page
              region_id: region.id, // Assuming region is an object with id
            }
          }
        );

        console.log(`Found ${response.count} products`);
        setProducts(response.products);
        setSelectedProduct(response.products[0]);
        // console.log(selectedProduct);

        // Process pricing and inventory
        const tempPrices: { [productId: string]: ProductPrices } = {};
        const tempInventory: { [productId: string]: InventoryStatus } = {};

        response.products.forEach((product: Product) => {
          const productPrices: ProductPrices = {};
          const productInventory: InventoryStatus = {};

          product.variants.forEach((variant) => {
            // Mock prices - replace with real pricing logic
            productPrices[variant.id] = {
              price: Math.floor(Math.random() * 50) + 30, // Random price between $30-80
              ...(Math.random() > 0.7 && {
                originalPrice: Math.floor(Math.random() * 30) + 80 // Random original price $80-110
              })
            };

            // Mock inventory - replace with real inventory data
            productInventory[variant.id] = Math.floor(Math.random() * 20);
          });

          tempPrices[product.id] = productPrices;
          tempInventory[product.id] = productInventory;
        });

        setPrices(tempPrices);
        setInventory(tempInventory);



      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllProducts();
  }, [region]); // Re-fetch when region changes


  // Mock Handlers
  const handleAddToCart = (product: Product, variantId: string, quantity = 1) => {
    console.log('Adding to cart:', product.title, 'Variant:', variantId, 'Quantity:', quantity);
    // Implement your cart logic here
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Adding to wishlist:', product.title);
    // Implement your wishlist logic here
  };
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProductPage />

      {/* Display products or loading state */}
      <div className="container mx-auto py-8">
        {isLoading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Products ({products.length})</h2>

            {/* Display first product with all its fields for inspection */}
            {products.length > 0 && (
              <div className="mb-8 p-4 bg-gray-50 rounded overflow-auto">
                <h3 className="text-xl font-bold mb-2">First Product Fields:</h3>
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
                  {JSON.stringify(products[0], null, 2)}
                </pre>
              </div>
            )}

            {/* Display all products in a grid */}

          </div>
        )}
      </div>


      <ProductDetailPage
        product={selectedProduct}
        prices={prices[selectedProduct.id]}
        inventoryStatus={inventory[selectedProduct.id]}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
      <div className="h-64"></div> {/* Using standard Tailwind class instead of arbitrary value */}
    </main>
  );
}