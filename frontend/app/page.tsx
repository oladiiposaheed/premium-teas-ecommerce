// app/page.tsx
import Link from "next/link";
import Image from 'next/image';
import { getProducts, getCategories, type Product } from "@/lib/api";
import CategoryDropdown from "@/components/CategoryDropdown";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  // Fetch products (filtered) and categories
  const products = await getProducts(category);
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      
      {/* Top Header with Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {category ? 'Filtered Products' : 'All Products'}
          </h1>
          <p className="text-slate-500 mt-1">Browse our collection of premium teas.</p>
        </div>

        {/* Client Component */}
        <div className="w-full md:w-64">
          <CategoryDropdown categories={categories} currentCategory={category} />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product: Product) => (
          <div key={product.id} className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col">
            
            <Link href={`/product/${product.slug}`} className="relative w-full aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4 block">
              {product.image ? (
                <Image 
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
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
  );
}