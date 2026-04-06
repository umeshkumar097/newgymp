import React from "react";
import { Users, Search, Filter, Shield, MoreVertical, Mail, Phone, Calendar, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteUserButton } from "./DeleteUserButton";
import { cn } from "@/lib/utils";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">User Management</h1>
          <p className="text-slate-500 text-sm font-medium">Monitor and manage all registered platform members.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white border border-slate-200/60 rounded-2xl flex items-center px-6 py-4 focus-within:border-brand-green/30 transition-all shadow-sm group">
            <Search size={18} className="text-slate-400 mr-4 group-focus-within:text-brand-green transition-colors" />
            <input 
               type="text" 
               placeholder="Search identifiers..." 
               className="bg-transparent border-none outline-none text-sm font-black text-slate-900 w-64 placeholder:text-slate-300 uppercase tracking-widest" 
            />
          </div>
          <button className="bg-slate-900 text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-brand-green hover:text-slate-950 transition-all shadow-lg active:scale-95 border border-slate-800">
            Export Records
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/60 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Identity & ID</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Communication</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">System Role</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Registration</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Status</th>
                <th className="px-10 py-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xs text-white shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
                        {user.name?.[0] || "U"}
                      </div>
                      <div>
                        <div className="text-base font-black text-slate-900 tracking-tight uppercase">{user.name || "Unnamed User"}</div>
                        <div className="text-[10px] text-slate-400 font-extrabold tracking-widest mt-1">UUID: {user.id.substring(0, 8).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600 font-semibold tracking-tight">
                        <Mail size={14} className="mr-3 text-brand-blue" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        <Phone size={14} className="mr-3 text-brand-green" />
                        {user.phone || "UNSYNCED"}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={cn(
                       "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border",
                       user.role === "ADMIN" ? "bg-purple-50 text-purple-600 border-purple-100" : 
                       user.role === "GYM_OWNER" ? "bg-orange-50 text-orange-600 border-orange-100" :
                       "bg-slate-50 text-slate-500 border-slate-100"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center text-sm font-black text-slate-500 tracking-tight">
                      <Calendar size={16} className="mr-3 text-slate-300" />
                      {new Date(user.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm group-hover:bg-brand-green/5 group-hover:border-brand-green/20 transition-all">
                      <div className="w-2 h-2 rounded-full bg-brand-green shadow-sm" />
                      <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">Active</span>
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
