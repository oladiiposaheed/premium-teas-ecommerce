
// Read the URL from the .env.local file
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Product {
    id: number;
    category: Category;
    name: string;
    slug: string;
    image: string | null;
    description: string;
    price: string;
    available: boolean;
}

// 1. Fetch all categories for the sidebar
export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/api/categories/`, { cache: 'no-store' });

    if (!res.ok) 
        throw new Error('Failed to fetch categories');
    return res.json();
}

// 2. Accept an optional categorySlug
export async function getProducts(categorySlug?: string): Promise<Product[]> {

    // If a category is provided, hit the category API endpoint
    const url = categorySlug
        ? `${API_URL}/api/products/${categorySlug}/`
        : `${API_URL}/api/products/`;

    const res = await fetch(url, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products')
    }

    return res.json();
}


export async function getProduct(slug: string) {
    const res = await fetch(`${API_URL}/api/products/detail/${slug}/`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }

    return res.json();
}