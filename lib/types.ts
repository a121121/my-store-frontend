export interface BaseCollection {
    /**
     * The collection's ID.
     */
    id: string;
    /**
     * The collection's title.
     */
    title: string;
    /**
     * The collection's handle.
     */
    handle: string;
    /**
     * The date the collection was created.
     */
    created_at: string;
    /**
     * The date the collection was updated.
     */
    updated_at: string;
    /**
     * The date the collection was deleted.
     */
    deleted_at: string | null;
    /**
     * The collection's products.
     */
    products?: BaseProduct[];
    /**
     * Key-value pairs of custom data.
     */
    metadata: Record<string, unknown> | null;
}
export interface BaseCalculatedPriceSet {
    /**
     * The ID of the price set.
     */
    id: string;
    /**
     * Whether the calculated price is associated with a price list. During the calculation process, if no valid price list is found,
     * the calculated price is set to the original price, which doesn't belong to a price list. In that case, the value of this property is `false`.
     */
    is_calculated_price_price_list?: boolean;
    /**
     * Whether the calculated price is tax inclusive.
     */
    is_calculated_price_tax_inclusive?: boolean;
    /**
     * The amount of the calculated price, or `null` if there isn't a calculated price.
     */
    calculated_amount: number | null;
    /**
     * The amount of the calculated price with taxes included. If the calculated price is tax inclusive, this field will be the same as `calculated_amount`.
     */
    calculated_amount_with_tax?: number | null;
    /**
     * The amount of the calculated price without taxes included. If the calculated price is tax exclusive, this field will be the same as `calculated_amount`.
     */
    calculated_amount_without_tax?: number | null;
    /**
     * Whether the original price is associated with a price list. During the calculation process, if the price list of the calculated price is of type override,
     * the original price will be the same as the calculated price. In that case, the value of this property is `true`.
     */
    is_original_price_price_list?: boolean;
    /**
     * Whether the original price is tax inclusive.
     */
    is_original_price_tax_inclusive?: boolean;
    /**
     * The amount of the original price, or `null` if there isn't a calculated price.
     */
    original_amount: number | null;
    /**
     * The amount of the original price with taxes included. If the original price is tax inclusive, this field will be the same as `original_amount`.
     */
    original_amount_with_tax: number | null;
    /**
     * The amount of the original price without taxes included. If the original price is tax exclusive, this field will be the same as `original_amount`.
     */
    original_amount_without_tax: number | null;
    /**
     * The currency code of the calculated price, or null if there isn't a calculated price.
     */
    currency_code: string | null;
    /**
     * The details of the calculated price.
     */
    calculated_price?: {
        /**
         * The ID of the price selected as the calculated price.
         */
        id: string | null;
        /**
         * The ID of the associated price list, if any.
         */
        price_list_id: string | null;
        /**
         * The type of the associated price list, if any.
         */
        price_list_type: string | null;
        /**
         * The `min_quantity` field defined on a price.
         */
        min_quantity: number | null;
        /**
         * The `max_quantity` field defined on a price.
         */
        max_quantity: number | null;
    };
    /**
     * The details of the original price.
     */
    original_price?: {
        /**
         * The ID of the price selected as the original price.
         */
        id: string | null;
        /**
         * The ID of the associated price list, if any.
         */
        price_list_id: string | null;
        /**
         * The type of the associated price list, if any.
         */
        price_list_type: string | null;
        /**
         * The `min_quantity` field defined on a price.
         */
        min_quantity: number | null;
        /**
         * The `max_quantity` field defined on a price.
         */
        max_quantity: number | null;
    };
}
export interface BaseProductOptionValue {
    /**
     * The option value's ID.
     */
    id: string;
    /**
     * The option's value.
     */
    value: string;
    /**
     * The option's details.
     */
    option?: BaseProductOption | null;
    /**
     * The ID of the option.
     */
    option_id?: string | null;
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown> | null;
    /**
     * The date the option value was created.
     */
    created_at?: string;
    /**
     * The date the option value was updated.
     */
    updated_at?: string;
    /**
     * The date the option value was deleted.
     */
    deleted_at?: string | null;
}
export interface BaseProductTag {
    /**
     * The tag's ID.
     */
    id: string;
    /**
     * The tag's value.
     */
    value: string;
    /**
     * The date the tag was created.
     */
    created_at: string;
    /**
     * The date the tag was updated.
     */
    updated_at: string;
    /**
     * The date the tag was deleted.
     */
    deleted_at?: string | null;
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown> | null;
}
export interface BaseProductVariant {
    /**
     * The variant's ID.
     */
    id: string;
    /**
     * The variant's title.
     */
    title: string | null;
    /**
     * The variant's SKU.
     */
    sku: string | null;
    /**
     * The variant's barcode.
     */
    barcode: string | null;
    /**
     * The variant's EAN.
     */
    ean: string | null;
    /**
     * The variant's UPC.
     */
    upc: string | null;
    /**
     * Whether the variant can be ordered even if it's out of stock.
     */
    allow_backorder: boolean | null;
    /**
     * Whether Medusa manages the variant's inventory. If disabled, the variant
     * is always considered in stock.
     */
    manage_inventory: boolean | null;
    /**
     * The variant's inventory quantity if `manage_inventory` is enabled.
     * This field is only retrieved in the [Get Product](https://docs.medusajs.com/api/store#products_getproductsid)
     * and [List Products](https://docs.medusajs.com/api/store#products_getproducts) API routes if you
     * pass `+variants.inventory_quantity` in the `fields` query parameter.
     *
     * Learn more in the [Retrieve Product Variant's Inventory](https://docs.medusajs.com/resources/storefront-development/products/inventory) storefront guide.
     */
    inventory_quantity?: number;
    /**
     * The variant's HS code.
     */
    hs_code: string | null;
    /**
     * The variant's origin country.
     */
    origin_country: string | null;
    /**
     * The variant's MID code.
     */
    mid_code: string | null;
    /**
     * The variant's material.
     */
    material: string | null;
    /**
     * The variant's weight.
     */
    weight: number | null;
    /**
     * The variant's length.
     */
    length: number | null;
    /**
     * The variant's height.
     */
    height: number | null;
    /**
     * The variant's width.
     */
    width: number | null;
    /**
     * The variant's ranking among its siblings.
     */
    variant_rank?: number | null;
    /**
     * The variant's values for the product's options.
     */
    options: BaseProductOptionValue[] | null;
    /**
     * The variant's product.
     */
    product?: BaseProduct | null;
    /**
     * The ID of the product that the variant belongs to.
     */
    product_id?: string;
    /**
     * The variant's calculated price for the provided context.
     */
    calculated_price?: BaseCalculatedPriceSet;
    /**
     * The date the variant was created.
     */
    created_at: string;
    /**
     * The date the variant was updated.
     */
    updated_at: string;
    /**
     * The date the variant was deleted.
     */
    deleted_at: string | null;
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown> | null;
}
export interface BaseProductOption {
    /**
     * The option's ID.
     */
    id: string;
    /**
     * The option's title.
     */
    title: string;
    /**
     * The product that the option belongs to.
     */
    product?: BaseProduct | null;
    /**
     * The ID of the product that the option belongs to.
     */
    product_id?: string | null;
    /**
     * The option's values.
     */
    values?: BaseProductOptionValue[];
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown> | null;
    /**
     * The date the option was created.
     */
    created_at?: string;
    /**
     * The date the option was updated.
     */
    updated_at?: string;
    /**
     * The date the option was deleted.
     */
    deleted_at?: string | null;
}
export interface BaseProductImage {
    /**
     * The image's ID.
     */
    id: string;
    /**
     * The image's URL.
     */
    url: string;
    /**
     * The rank of the product image.
     */
    rank: number;
    /**
     * The date the image was created.
     */
    created_at?: string;
    /**
     * The date the image was updated.
     */
    updated_at?: string;
    /**
     * The date the image was deleted.
     */
    deleted_at?: string | null;
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown> | null;
}
export interface BaseProductType {
    /**
     * The product type's ID.
     */
    id: string;
    /**
     * The product type's value.
     */
    value: string;
    /**
     * The date the product type was created.
     */
    created_at: string;
    /**
     * The date the product type was updated.
     */
    updated_at: string;
    /**
     * The date the product type was deleted.
     */
    deleted_at?: string | null;
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown> | null;
}
export interface BaseProductCategory {
    /**
     * The category's ID.
     */
    id: string;
    /**
     * The category's name.
     */
    name: string;
    /**
     * The category's description.
     */
    description: string;
    /**
     * The product category's unique handle. Can be used to create
     * human-readable URLs.
     */
    handle: string;
    /**
     * Whether the category is active.
     */
    is_active: boolean;
    /**
     * Whether the category is internal.
     */
    is_internal: boolean;
    /**
     * The category's ranking among sibling categories.
     */
    rank: number | null;
    /**
     * The ID of the category's parent.
     */
    parent_category_id: string | null;
    /**
     * The category's parent.
     */
    parent_category: BaseProductCategory | null;
    /**
     * The category's children.
     */
    category_children: BaseProductCategory[];
    /**
     * The category's products.
     */
    products?: BaseProduct[];
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown> | null;
    /**
     * The date the category was created.
     */
    created_at: string;
    /**
     * The date the category was updated.
     */
    updated_at: string;
    /**
     * The date the category was deleted.
     */
    deleted_at: string | null;
}
export type ProductStatus = "draft" | "proposed" | "published" | "rejected";
export interface BaseProduct {

    // Product ID
    id: string;
    /**
     * The product's title.
     */
    title: string;
    /**
     * The product's handle.
     */
    handle: string;
    /**
     * The product's subtitle.
     */
    subtitle: string | null;
    /**
     * The product's description.
     */
    description: string | null;
    /**
     * Whether the product is a gift card.
     */
    is_giftcard: boolean;
    /**
     * The product's status.
     */
    status: ProductStatus;
    /**
     * The product's thumbnail.
     */
    thumbnail: string | null;
    /**
     * The product's width.
     */
    width: number | null;
    /**
     * The product's weight.
     */
    weight: number | null;
    /**
     * The product's length.
     */
    length: number | null;
    /**
     * The product's height.
     */
    height: number | null;
    /**
     * The product's origin country.
     */
    origin_country: string | null;
    /**
     * The product's HS code.
     */
    hs_code: string | null;
    /**
     * The product's MID code.
     */
    mid_code: string | null;
    /**
     * The product's material.
     */
    material: string | null;
    /**
     * The product's collection.
     */
    collection?: BaseCollection | null;
    /**
     * The ID of the associated product collection.
     */
    collection_id: string | null;
    /**
     * The product's categories.
     */
    categories?: BaseProductCategory[] | null;
    /**
     * The product's type.
     */
    type?: BaseProductType | null;
    /**
     * The ID of the associated product type.
     */
    type_id: string | null;
    /**
     * The product's tags.
     */
    tags?: BaseProductTag[] | null;
    /**
     * The product's variants.
     */
    variants: BaseProductVariant[] | null;
    /**
     * The product's options.
     */
    options: BaseProductOption[] | null;
    /**
     * The product's images.
     */
    images: BaseProductImage[] | null;
    /**
     * Whether the product is discountable.
     */
    discountable: boolean;
    /**
     * The ID of the product in external systems.
     */
    external_id: string | null;
    /**
     * The date the product was created.
     */
    created_at: string | null;
    /**
     * The date the product was update.
     */
    updated_at: string | null;
    /**
     * The date the product was deleted.
     */
    deleted_at: string | null;
    /**
     * Key-value pairs of custom data.
     */
    metadata?: Record<string, unknown> | null;
}