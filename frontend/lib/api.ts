
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

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/api/products/`, {
        cache: 'no-cache'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    return res.json();
}

export async function getProduct(slug: string) {
    const res = await fetch(`${API_URL}/api/products/${slug}/`, {
        cache: 'no-cache'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }

    return res.json();
}