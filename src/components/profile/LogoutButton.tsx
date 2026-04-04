"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: "/auth",
        redirect: true 
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full py-5 rounded-2xl border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-2"
    >
      <LogOut size={16} />
      <span>Sign Out</span>
    </button>
  );
}
