// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Teas | Buy Fresh Loose-Leaf Teas",
  description: "Shop high-quality loose-leaf teas delivered fresh to your door. Find your new favorite daily brew.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        
        <CartProvider>

          <Header />

          <main className="min-h-screen">
            {children}
          </main> 
        </CartProvider>
      </body>
    </html>
  );
}