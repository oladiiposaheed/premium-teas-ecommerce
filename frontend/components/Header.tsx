'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { cart } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900">
          Premium Teas<span className="text-blue-600">.</span>
        </Link>
        
        {/* Cart Badge */}
        <Link 
          href="/cart" 
          className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className="font-semibold text-slate-700 text-sm">
            {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'}
          </span>
          <span className="w-px h-4 bg-slate-300"></span>
          <span className="font-bold text-blue-600 text-sm">
            ${cart.total_price}
          </span>
        </Link>
      </div>
    </header>
  );
}