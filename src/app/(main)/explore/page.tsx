import React from "react";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { gyms } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";

export default function ExplorePage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 p-6 space-y-8 pb-32">
      <div className="space-y-2 mt-8">
        <h1 className="text-3xl font-black font-outfit text-white">Explore</h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Find the best fitness centers near you</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input 
          type="text" 
          placeholder="Search gyms, activities..." 
          className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm font-medium focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-zinc-700"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500">
          <Filter size={18} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
        {["All", "Gym", "Yoga", "Swimming", "Crossfit", "MMA"].map((cat) => (
          <button key={cat} className="whitespace-nowrap px-6 py-2 rounded-full border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-orange-500 transition-all">
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 gap-6">
        {gyms.map((gym) => (
          <Link href={`/gyms/${gym.id}`} key={gym.id} className="group relative rounded-[2.5rem] bg-zinc-900 border border-white/5 p-4 flex space-x-4 active:scale-95 transition-all">
            <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden">
               <Image src={gym.image} alt={gym.name} fill className="object-cover" />
            </div>
            <div className="flex-1 py-1 flex flex-col justify-between">
               <div>
                  <h3 className="font-bold text-white text-sm">{gym.name}</h3>
                  <div className="flex items-center text-zinc-500 text-[10px] font-medium mt-1">
                    <MapPin size={10} className="mr-1 text-orange-500" />
                    {gym.location}
                  </div>
               </div>
               <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-black text-white">{gym.rating}</span>
                  </div>
                  <div className="text-orange-500 font-black text-sm">₹{gym.price.replace('₹', '')}</div>
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
