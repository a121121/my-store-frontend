import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { HttpTypes } from "@medusajs/types";
import { getProductPrice } from "@/lib/get-product-price";


interface ProductDetailPageProps {
  product: HttpTypes.StoreProduct;
  onAddToCart?: (product: HttpTypes.StoreProduct, variantId: string, quantity: number) => void;
  onAddToWishlist?: (product: HttpTypes.StoreProduct) => void;
  relatedProducts?: HttpTypes.StoreProduct[];
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  relatedProducts = []
}) => {
  // State for selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    // product.variants?.[0]?.id || ''
    product.variants && product.variants.length > 0 ? product.variants[0]?.id || '' : ''
  );

  // Track selected option values
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    // Initialize with first option value for each option
    const initialOptions: Record<string, string> = {};
    if (product.options) {
      product.options.forEach(option => {
        if (option.values && option.values.length > 0) {
          initialOptions[option.id] = option.values[0].value;
        }
      });
    }
    return initialOptions;
  });

  // Selected image index for the gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Find the variant that matches the currently selected options
  // const findMatchingVariant = (): HttpTypes.StoreProductVariant | undefined => {
  //   if (!product.variants) return undefined;

  //   return product.variants.find(variant => {
  //     if (!variant.options) return false;

  //     return variant.options.every(option => {
  //       return option.option_id && selectedOptions[option.option_id] === option.value;
  //     });
  //   });
  // };
  const findMatchingVariant = (): HttpTypes.StoreProductVariant | undefined => {
    if (!product.variants || product.variants.length === 0) return undefined;

    return product.variants.find(variant => {
      if (!variant.options || variant.options.length === 0) return false;

      return variant.options.every(option => {
        return option.option_id && selectedOptions[option.option_id] === option.value;
      });
    });
  };

  // Get the currently selected variant
  const selectedVariant = findMatchingVariant() || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);

  // Get pricing information
  const priceData = getProductPrice({ product, variantId: selectedVariantId });
  const cheapestPrice = priceData.cheapestPrice;

  const price = cheapestPrice?.calculated_price_number
    ? cheapestPrice.calculated_price_number / 100
    : 0;

  const originalPrice = cheapestPrice?.original_price_number
    ? cheapestPrice.original_price_number / 100
    : undefined;

  const hasDiscount = originalPrice && originalPrice > price;

  const discount = hasDiscount && price > 0
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // Check if product is in stock
  const inStock = selectedVariant
    ? selectedVariant.inventory_quantity === undefined || selectedVariant.inventory_quantity > 0
    : false;

  // Inventory quantity for the selected variant
  const inventoryQuantity = selectedVariant?.inventory_quantity;

  // Handle option change
  const handleOptionChange = (optionId: string, value: string) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [optionId]: value
    };

    setSelectedOptions(newSelectedOptions);

    // Find matching variant based on new option selections
    const variant = product.variants?.find(variant => {
      if (!variant.options) return false;

      return variant.options.every(option => {
        return option.option_id && newSelectedOptions[option.option_id] === option.value;
      });
    });

    if (variant) {
      setSelectedVariantId(variant.id);
    }
  };

  // Image gallery navigation
  const handleNextImage = () => {
    if (!product.images || product.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === product.images!.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (!product.images || product.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images!.length - 1 : prev - 1
    );
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!selectedVariantId) return;

    setIsLoading(true);
    // Simulate API call or actually call your cart function
    setTimeout(() => {
      if (onAddToCart) onAddToCart(product, selectedVariantId, quantity);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images?.[currentImageIndex]?.url || product.thumbnail || "/api/placeholder/600/600"}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {/* Image Navigation */}
            {product.images && product.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 rounded-full"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full"
                  onClick={handleNextImage}
                >
                  <ChevronRight size={20} />
                </Button>
              </>
            )}

            {/* Sale Badge */}
            {hasDiscount && discount > 0 && (
              <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={image.id}
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={`${product.title} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {product.collection && (
              <div className="mt-2">
                <Badge variant="outline">{product.collection.title}</Badge>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-bold">${price.toFixed(2)}</span>
                <span className="text-xl text-gray-500 line-through">${originalPrice?.toFixed(2)}</span>
                {discount > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600">-{discount}% OFF</Badge>
                )}
              </>
            ) : (
              <span className="text-3xl font-bold">${price.toFixed(2)}</span>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Availability:</span>
            {inStock ? (
              <span className="text-green-600 font-medium">
                In Stock {inventoryQuantity !== undefined && `(${inventoryQuantity} available)`}
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Product Description */}
          <div>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Product Options */}
          <div className="space-y-4">
            {product.options?.map(option => (
              <div key={option.id}>
                <h3 className="text-sm font-medium mb-2">{option.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.values?.map(value => (
                    <Button
                      key={value.id}
                      variant={selectedOptions[option.id] === value.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleOptionChange(option.id, value.value)}
                    >
                      {value.value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="mx-4 min-w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(prev => prev + 1)}
                disabled={!inStock || (inventoryQuantity !== undefined && quantity >= inventoryQuantity)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 gap-2"
              size="lg"
              onClick={handleAddToCart}
              disabled={!inStock || isLoading}
            >
              <ShoppingCart size={20} />
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => onAddToWishlist && onAddToWishlist(product)}
            >
              <Heart size={20} />
              Add to Wishlist
            </Button>
            <Button
              variant="outline"
              size="icon"
            >
              <Share2 size={20} />
            </Button>
          </div>

          {/* Product Details */}
          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4">
              <p>{product.description}</p>
            </TabsContent>
            <TabsContent value="details" className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">SKU</div>
                <div className="text-sm">{selectedVariant?.sku || 'N/A'}</div>

                <div className="text-sm font-medium">Weight</div>
                <div className="text-sm">{product.weight ? `${product.weight}g` : 'N/A'}</div>

                <div className="text-sm font-medium">Dimensions</div>
                <div className="text-sm">
                  {product.length && product.width && product.height
                    ? `${product.length}×${product.width}×${product.height} cm`
                    : 'N/A'}
                </div>

                <div className="text-sm font-medium">Origin</div>
                <div className="text-sm">{product.origin_country || 'N/A'}</div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="p-4">
              <p>Standard shipping available. Free shipping on orders over $100.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Here you would map through related products and render ProductCard components */}
            {/* This would be implemented in the page component */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;