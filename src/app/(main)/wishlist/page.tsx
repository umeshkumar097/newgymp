import React from "react";
import { Heart, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 p-6 space-y-8 pb-32">
      <div className="space-y-2 mt-8">
        <h1 className="text-3xl font-black font-outfit text-white">Wishlist</h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Your favorite fitness destinations</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 flex-1 py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700 border border-white/5">
          <Heart size={40} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Your wishlist is empty</h2>
          <p className="text-sm text-zinc-500 max-w-[200px]">Save your favorite gyms to easily find them later.</p>
        </div>
        <Link href="/" className="bg-orange-500 text-white font-black py-4 px-8 rounded-full shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center space-x-2">
          <span>Explore Gyms</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
