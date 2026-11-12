'use client';

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
    const { cart } = useCart();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        postal_code: '',
        city: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return; // Prevent double-clicks
        setIsLoading(true);

        try {
            // 1. Create Order
            const orderRes = await fetch(`${API_URL}/api/orders/create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            const orderId = orderData.order_id;

            // 2. Create Payment Session
            const paymentRes = await fetch(`${API_URL}/api/payment/process/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ order_id: orderId }),
            });

            const paymentData = await paymentRes.json();
            
            console.log("Django Payment Response:", paymentData);

            if (!paymentRes.ok) {
                throw new Error(paymentData.error || 'Failed to create payment session');
            }

            // 3. Redirect to Stripe
            if (paymentData && paymentData.checkout_url) {
                window.location.href = paymentData.checkout_url;
            } else {
                // If this triggers, it will tell us exactly what Django returned
                throw new Error(`Stripe URL missing. Django said: ${JSON.stringify(paymentData)}`);
            }
                
        } catch (error: any) {
            console.error(error);
            alert(error.message);
            setIsLoading(false);
        }
    };
    
    if (cart.items.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 mb-4">Your cart is empty.</p>
                <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Go back to the shop</a>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-extrabold mb-8 text-slate-900">Checkout</h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input required name="first_name" placeholder="First Name" onChange={handleChange} className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <input required name="last_name" placeholder="Last Name" onChange={handleChange} className="border border-slate-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                
                <input type="email" required name="email" placeholder="Email" onChange={handleChange} className="border border-slate-300 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <input required name="address" placeholder="Address" onChange={handleChange} className="border border-slate-300 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <input required name="postal_code" placeholder="Postal Code" onChange={handleChange} className="border border-slate-300 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    <input required name="city" placeholder="City" onChange={handleChange} className="border border-slate-300 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:bg-gray-400"
                >
                    {isLoading ? 'Processing...' : `Pay $${cart.total_price}`}
                </button>
            </form>
        </div>
    )
}