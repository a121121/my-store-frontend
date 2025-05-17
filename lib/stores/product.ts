// lib/stores/products.ts
import { create } from 'zustand';
import { HttpTypes } from "@medusajs/types";

interface ProductsState {
    products: HttpTypes.StoreProduct[];
    setProducts: (products: HttpTypes.StoreProduct[]) => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
}));