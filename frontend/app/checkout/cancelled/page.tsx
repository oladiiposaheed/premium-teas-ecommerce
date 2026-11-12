import Link from "next/link";

export default function CancelledPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                Payment Cancelled
            </h1>
            <p className="text-lg text-slate-600 mb-8">
                Your payment was not processed. Your cart is still saved.
            </p>
            <Link
                href='/cart'
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
                Return to Cart
            </Link>
        </div>
    )
}