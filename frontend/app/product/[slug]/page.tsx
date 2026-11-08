export const dynamic = 'force-dynamic';


import Link from 'next/link';
import Image from 'next/image';
import { getProduct, type Product } from '@/lib/api';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import { Suspense } from 'react'; 


async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let product: Product;

  try {
    product = await getProduct(slug);
  } catch (error) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Products
      </Link>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            {product.image ? (
              <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400"><span className="text-sm uppercase tracking-widest text-center">No image<br/>available</span></div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-gray-900 mb-6">${product.price}</p>
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}

// 2. The main page component wraps the content in Suspense
export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-4 py-8 text-center">Loading tea details...</div>}>
      <ProductContent params={params} />
    </Suspense>
  );
}