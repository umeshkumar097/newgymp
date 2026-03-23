import React from "react";
import { Users, Search, Filter, Shield, MoreVertical, Mail, Phone, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteUserButton } from "./DeleteUserButton";
import { cn } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-12 font-outfit bg-[#0B0F19] -m-8 p-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">User Management</h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.1em]">Monitor and manage all registered PassFit members</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-zinc-900 border border-white/10 rounded-[1.5rem] flex items-center px-6 py-4 focus-within:border-brand-green/30 transition-all shadow-xl group">
            <Search size={18} className="text-slate-600 mr-4 group-focus-within:text-brand-green transition-colors" />
            <input 
               type="text" 
               placeholder="Search identifiers..." 
               className="bg-transparent border-none outline-none text-sm font-black text-white w-64 placeholder:text-slate-700 uppercase tracking-widest" 
            />
          </div>
          <button className="bg-white text-zinc-950 font-black px-8 py-4 rounded-[1.5rem] text-[10px] uppercase tracking-[0.2em] hover:bg-brand-green transition-all shadow-3xl active:scale-95">
            Export Records
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-[3.5rem] overflow-hidden shadow-4xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-950/50 border-b border-white/10">
              <tr>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity & Hub ID</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Secure Contact</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Protocol Role</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Joined Date</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Lifecycle</th>
                <th className="px-10 py-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900 transition-all group border-white/5">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center font-black text-xs text-white shadow-lg shadow-black/40 group-hover:scale-110 transition-transform">
                        {user.name?.[0] || "U"}
                      </div>
                      <div>
                        <div className="text-base font-black text-white tracking-tight uppercase group-hover:text-brand-green transition-colors">{user.name || "Unnamed User"}</div>
                        <div className="text-[10px] text-slate-500 font-black tracking-widest mt-1">UUID: {user.id.substring(0, 8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-300 font-medium tracking-wide">
                        <Mail size={14} className="mr-3 text-brand-blue" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-[11px] text-slate-500 font-black uppercase tracking-widest">
                        <Phone size={14} className="mr-3 text-brand-green" />
                        {user.phone || "No phone sync"}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={cn(
                       "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border",
                       user.role === "ADMIN" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : 
                       user.role === "GYM_OWNER" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                       "bg-zinc-950 text-slate-500 border-white/5"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center text-sm font-black text-slate-400 italic tracking-tight">
                      <Calendar size={16} className="mr-3 text-slate-600" />
                      {new Date(user.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-brand-green/5 border border-brand-green/10 shadow-inner group-hover:bg-brand-green/10 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">Authenticated</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <DeleteUserButton userId={user.id} userName={user.name || "User"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
