import React from "react";
import { Settings, ArrowLeft, Save, User, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const user = await prisma.user.findFirst({
    where: { email: "test@example.com" }
  });

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 p-6 space-y-8 pb-32">
      <div className="flex items-center space-x-4 mt-8">
        <Link href="/profile" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 border border-white/5 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black font-outfit text-white">Settings</h1>
      </div>

      <div className="space-y-8">
        {/* Profile Info Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-2">Account Information</h3>
          
          <div className="space-y-4">
             <div className="p-6 rounded-[2rem] bg-zinc-900/40 border border-white/5 space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Full Name</label>
                   <div className="flex items-center space-x-3 bg-zinc-950 p-4 rounded-2xl border border-white/5">
                      <User size={16} className="text-zinc-600" />
                      <input 
                        type="text" 
                        defaultValue={user.name || ""} 
                        className="bg-transparent border-none outline-none text-white font-bold text-sm w-full"
                        placeholder="Enter your name"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Email Address</label>
                   <div className="flex items-center space-x-3 bg-zinc-950 p-4 rounded-2xl border border-white/5 opacity-50">
                      <Mail size={16} className="text-zinc-600" />
                      <input 
                        type="email" 
                        value={user.email} 
                        readOnly
                        className="bg-transparent border-none outline-none text-white font-bold text-sm w-full cursor-not-allowed"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Phone Number</label>
                   <div className="flex items-center space-x-3 bg-zinc-950 p-4 rounded-2xl border border-white/5">
                      <Phone size={16} className="text-zinc-600" />
                      <input 
                        type="tel" 
                        defaultValue={user.phone || ""} 
                        className="bg-transparent border-none outline-none text-white font-bold text-sm w-full"
                        placeholder="Add phone number"
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-orange-500 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-orange-500/20 flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs uppercase tracking-widest">
           <Save size={18} />
           <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
