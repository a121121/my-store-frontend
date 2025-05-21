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
import { use } from "react";
import { useCart } from "@/providers/cart";


interface ProductPageProps {
    params: Promise<{ id: string }>; // Update type to reflect params as a Promise
}

export default function ProductPage({ params: paramsPromise }: ProductPageProps) {
    // Unwrap params using React.use
    const params = use(paramsPromise);

    //Cart things
    const { cart, addToCart } = useCart();

    // Get region context
    const { region } = useRegion();

    // Get pre-loaded products from store
    const { products } = useProductsStore();

    // Fetch product with SWR
    const { data: product, error, isLoading } = useSWR<HttpTypes.StoreProduct>(
        region ? [`/api/products/${params.id}`, region.id] : null,
        async ([_, regionId]) => {
            return retrieveProduct({
                id: params.id, // Use unwrapped params
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
        return (
            <ErrorMessage
                title="Product loading failed"
                message="Could not load product details. Please try again later."
                retry={() => window.location.reload()}
            />
        );
    }

    if (isLoading && !product) {
        return <LoadingSpinner className="mx-auto my-12" />;
    }

    if (!product) {
        return (
            <ErrorMessage
                title="Product not found"
                message="The requested product could not be found."
            />
        );
    }

    return (
        <>
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-16 sm:mt-20 lg:mt-24">
                <ProductDetailPage product={product} />
            </section>

            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-8 sm:mt-10 lg:mt-12 flex flex-col gap-4">
                <div className="flex justify-center items-center mb-6 sm:mb-8">
                    <div className="relative flex items-center">
                        <div className="hidden sm:block absolute left-0 -translate-x-full mr-4">
                            <div className="w-16 h-8 bg-contain bg-no-repeat bg-center baby-pattern-left"></div>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold px-4 py-2 text-center baby-heading">
                            You May Also Like
                        </h2>
                        <div className="hidden sm:block absolute right-0 translate-x-full ml-4">
                            <div className="w-16 h-8 bg-contain bg-no-repeat bg-center baby-pattern-right"></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {/* Will add products here */}
                </div>
            </section>
        </>
    );
}