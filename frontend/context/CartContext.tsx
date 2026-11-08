'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {

    // 1. State: Holds the cart data fetched from Django
    const [cart, setCart] = useState({ items: [], total_items: 0, total_price: '0.00' });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // 2. Fetch the current cart from the backend
    const refreshCart = useCallback(async () => {
        const res = await fetch(`${API_URL}/api/cart/`, { credentials: 'include' });

        const data = await res.json();
        setCart(data);
    }, [API_URL]);

    // 3. Add or Update an item in the cart
    const addToCart = async (productId: number, quantity: number = 1, override: false) => {
        await fetch(`${API_URL}/api/cart/add/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            // Pass quantity and override flag to backend
            body: JSON.stringify({ product_id: productId, quantity: quantity, override: override }),
        });

        await refreshCart();
    };

    // 4. Remove an item from the cart
    const removeFromCart = async (productId: number) => {
        await fetch(`${API_URL}/api/cart/remove/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ product_id: productId }),
        });

        await refreshCart();
    };

    // 5. Load the cart when the app starts
    useEffect(() => {
        const loadCart = async () => {
            await refreshCart();
        };
        loadCart()
    }, [refreshCart]);

    // 6. Provide the state and functions to the whole app
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to access the cart easily
export const useCart = () => useContext(CartContext);