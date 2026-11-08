export const dynamic = 'force-dynamic';

import Link from "next/link";
import Image from 'next/image';
import { getProducts, type Product } from "@/lib/api";


export default async function Home() {
  const products = await getProducts();

  return (
    
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 text-slate-800">Categories</h2>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/" className="block px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-medium transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/" className="block px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors">
                  Tea
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Featured Blends</h1>
          </div>
       
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: Product) => (
              <div key={product.id} className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                
                <Link href={`/product/${product.slug}`} className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4 block">
                  {product.image ? (
                    <Image 
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ): (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <span className="text-xs uppercase tracking-widest text-center">No Image</span>
                    </div>
                  )}
                </Link>

                <div className="flex justify-between items-start mt-auto">
                  <div>
                    <Link href={`/product/${product.slug}`} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {product.name}
                    </Link>
                    <p className="text-sm font-medium text-slate-500 mt-1">{product.category.name}</p>
                  </div>
                  <p className="text-lg font-extrabold text-slate-900">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}