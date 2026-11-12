'use client';

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartButton({ productId }: { productId: number }) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        setIsAdding(true);

        try {
            await addToCart(productId);
            //alert("Successfully added to cart!"); 
        } catch (error) {
         console.error("Failed to add:", error);   
       //  alert("Failed to add to cart. Check console.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <button
            onClick={handleAdd}
            disabled={isAdding}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:bg-gray-400"
        >
            {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
    )
}