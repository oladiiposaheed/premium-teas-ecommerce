// app/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function CartItemRow({ item, addToCart, removeFromCart, API_URL }: any) {
  const [qty, setQty] = useState(item.quantity);

  useEffect(() => {
    setQty(item.quantity);
  }, [item.quantity])

  const handleUpdate = () => {
    addToCart(item.product_id, qty, true);
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-6 items-center p-3 md:px-6 md:py-4 border-b border-slate-100 hover:bg-slate-50/50 transition-colors gap-2 md:gap-0">
      
      {/* 1. Image & Product */}
      <div className="flex items-center gap-3 w-full md:col-span-2 md:justify-start">
        {/* Reduced image size to w-14 h-14 */}
        <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm">
          {item.image && (
            <Image src={`${API_URL}${item.image}`} alt={item.name} fill sizes="56px" className="object-cover" />
          )}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm md:text-base">{item.name}</p>
          <p className="text-xs text-slate-500 md:hidden">Unit: ${item.price}</p>
        </div>
      </div>

      {/* 2. Quantity */}
      <div className="flex items-center justify-between md:justify-center w-full md:w-auto">
        <span className="text-xs font-semibold text-slate-500 md:hidden">Quantity:</span>
        <div className="flex items-center gap-1">
          <input 
            type="number" 
            min="1"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
            className="w-12 border border-slate-300 rounded-md p-1 text-center text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button 
            onClick={handleUpdate}
            className="text-blue-600 text-xs font-bold hover:underline px-1"
          >
            Update
          </button>
        </div>
      </div>

      {/* 3. Remove */}
      <div className="flex items-center justify-between md:justify-center w-full md:w-auto">
        <span className="text-xs font-semibold text-slate-500 md:hidden">Action:</span>
        <button 
          onClick={() => removeFromCart(item.product_id)}
          className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors"
        >
          Remove
        </button>
      </div>

      {/* 4. Unit Price */}
      <div className="hidden md:block text-center text-slate-500 font-medium text-sm">
        ${item.price}
      </div>

      {/* 5. Total Price */}
      <div className="w-full md:w-auto flex justify-between md:justify-end items-center">
        <span className="text-xs font-semibold text-slate-500 md:hidden">Total:</span>
        <span className="font-bold text-slate-900 text-sm md:text-base">
          ${item.total_price}
        </span>
      </div>

    </div>
  );
}

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useCart();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    // Reduced top/bottom padding from py-12 to py-6
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      
      {/* Reduced title size and margin */}
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-slate-900 tracking-tight">
        Your Shopping Cart
      </h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 mb-4 text-sm">Your cart is currently empty.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-6 bg-slate-100 px-6 py-4 text-xs font-extrabold text-slate-700 uppercase tracking-widest border-b border-slate-200">
            <div className="col-span-2 text-left">Product</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Remove</div>
            <div className="text-center">Unit Price</div>
            <div className="text-right">Total</div>
          </div>

          {/* Items */}
          {cart.items.map((item: any) => (
            <CartItemRow 
              key={item.product_id} 
              item={item} 
              addToCart={addToCart} 
              removeFromCart={removeFromCart}
              API_URL={API_URL}
            />
          ))}

          {/* Total Row */}
          <div className="flex justify-between items-center bg-slate-100 px-6 py-5 border-t border-slate-200">
            <div className="font-extrabold text-slate-800 text-sm tracking-widest uppercase">Total</div>
            <div className="font-black text-slate-900 text-2xl md:text-3xl">${cart.total_price}</div>
          </div>

        </div>
      )}

      {/* Buttons */}
      {cart.items.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          <Link 
            href="/" 
            className="w-full sm:w-auto text-center px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg transition-colors shadow-sm"
          >
            Continue shopping
          </Link>
          <button className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-semibold text-sm rounded-lg shadow-md transition-colors">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}