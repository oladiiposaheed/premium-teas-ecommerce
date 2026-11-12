import Link from "next/link";

export default function SuccessPage() {

    return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center"> 
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                Payment Successful!
            </h1>
            <p className="text-lg text-slate-600 mb-6">
                Thank you for your order. We are preparing your tea right now.
            </p>
            <Link
                href='/'
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
                Return to Shop
            </Link>
        </div>
    );
}