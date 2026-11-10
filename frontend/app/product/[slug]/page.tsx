// app/product/[slug]/page.tsx
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { getProduct, type Product } from '@/lib/api';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let product: Product;

  try {
    product = await getProduct(slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
        &larr; Back to Products
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            {product.image ? (
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover" 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <span className="text-sm uppercase tracking-widest text-center">No image<br/>available</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col pt-2">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-600 mb-6">${product.price}</p>
          <p className="text-slate-600 mb-8 leading-relaxed text-lg">{product.description}</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}