// app/products/[id]/page.tsx
'use client'

import { HttpTypes } from "@medusajs/types";
import useSWR from "swr";
import { useProductsStore } from "@/lib/stores/product";
import { retrieveProduct } from "@/lib/products";
import ProductDetailPage from "@/components/ProductDetailsPageTest";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRegion } from "@/providers/region";

interface ProductPageProps {
    params: {
        id: string;
    };
}

export default function ProductPage({ params }: ProductPageProps) {
    // Get region context
    const { region } = useRegion();

    // Get pre-loaded products from store
    const { products } = useProductsStore();

    // Fetch product with SWR
    const { data: product, error, isLoading } = useSWR<HttpTypes.StoreProduct>(
        region ? [`/api/products/${params.id}`, region.id] : null,
        async ([_, regionId]) => {
            return retrieveProduct({
                id: params.id,
                regionId: region!.id // Using region.id directly from context
            });
        },
        {
            fallbackData: products.find((p) => p.id === params.id),
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    );

    if (error) {
        return <ErrorMessage
            title="Product loading failed"
            message="Could not load product details. Please try again later."
            retry={() => window.location.reload()}
        />;
    }

    if (isLoading && !product) {
        return <LoadingSpinner className="mx-auto my-12" />;
    }

    if (!product) {
        return <ErrorMessage
            title="Product not found"
            message="The requested product could not be found."
        />;
    }

    return <ProductDetailPage product={product} />;
}