// components/CategoryDropdown.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Category } from '@/lib/api';

export default function CategoryDropdown({ 
  categories, 
  currentCategory 
}: { 
  categories: Category[], 
  currentCategory?: string 
}) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = e.target.value;
    
    // If "All Categories" is selected, go to homepage. Otherwise, add the query param.
    if (selectedSlug) {
      router.push(`/?category=${selectedSlug}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <select 
      onChange={handleChange} 
      value={currentCategory || ""}
      className="w-full bg-white border border-slate-300 text-slate-700 py-2.5 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}