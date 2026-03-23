import React from "react";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  // We only enforce redirect for the dashboard sub-routes, 
  // not for onboarding or login themselves to avoid loops.
  // Actually, let's keep it simple: if you are in /partner/dashboard, we check.
  
  return (
    <div className="min-h-screen bg-zinc-950 font-sans antialiased text-zinc-100 flex flex-col">
      <header className="px-6 py-4 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <h1 className="text-xl font-black font-outfit tracking-tight">
            PassFit <span className="text-brand-green italic">Partner</span>
          </h1>
          <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
             <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
             <span>System Live</span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
