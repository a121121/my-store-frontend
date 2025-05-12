import { HttpTypes } from "@medusajs/types";
import { Product } from "@/components/ProductCard"; // Import your Product interface
import { getProductPrice } from "@/lib/get-product-price";

/**
 * Adapts a Medusa product to the format expected by the ProductCard component
 */
export const adaptMedusaProduct = (medusaProduct: HttpTypes.StoreProduct): Product => {
    // Use the getProductPrice utility to get formatted prices with proper currency
    const priceData = getProductPrice({ product: medusaProduct });

    // Get price info from cheapest variant
    const cheapestPrice = priceData.cheapestPrice;

    // Calculate price and discounted price if available
    let price = 0;
    let discountedPrice: number | undefined = undefined;
    let currencyCode = "USD"; // Default currency code
    let formattedPrice = "";
    let formattedDiscountedPrice = "";

    if (cheapestPrice) {
        currencyCode = cheapestPrice.currency_code;

        // If there's a discounted price
        if (
            cheapestPrice.original_price_number &&
            cheapestPrice.calculated_price_number &&
            cheapestPrice.original_price_number > cheapestPrice.calculated_price_number
        ) {
            // Store numerical values for calculations
            price = cheapestPrice.original_price_number / 100;
            discountedPrice = cheapestPrice.calculated_price_number / 100;

            // Store formatted prices with currency symbols
            formattedPrice = cheapestPrice.original_price;
            formattedDiscountedPrice = cheapestPrice.calculated_price;
        } else if (cheapestPrice.calculated_price_number) {
            // Just regular price
            price = cheapestPrice.calculated_price_number / 100;
            formattedPrice = cheapestPrice.calculated_price;
        }
    }

    // Get first image if available
    const imageUrl = medusaProduct.images && medusaProduct.images.length > 0
        ? medusaProduct.images[0].url
        : "/api/placeholder/400/400";

    // Map to the Product interface
    return {
        id: medusaProduct.id,
        title: medusaProduct.title,
        description: medusaProduct.description || "",
        price,
        discountedPrice,
        imageUrl,
        category: "Product", // Default category since it's not in the Medusa data
        rating: 5, // Default rating since it's not in the Medusa data
        reviewCount: 0, // Default review count since it's not in the Medusa data
        inStock: medusaProduct.variants?.some(variant =>
            variant.inventory_quantity === undefined || variant.inventory_quantity > 0
        ) || true, // Default to true if inventory data is not available
        currencyCode,
        formattedPrice,
        formattedDiscountedPrice
    };
};