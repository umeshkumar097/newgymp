import React from "react";
import { Users, Search, Filter, Shield, MoreVertical, Mail, Phone, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">User Management</h1>
          <p className="text-zinc-500 text-sm font-medium">Monitor and manage all registered PassFit members</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl flex items-center px-4 py-2 focus-within:border-brand-green/30 transition-all">
            <Search size={16} className="text-zinc-600 mr-2" />
            <input type="text" placeholder="Search users..." className="bg-transparent border-none outline-none text-sm font-medium text-white w-48" />
          </div>
          <button className="bg-brand-green text-zinc-950 font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all">
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">User Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Contact</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Joined</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Status</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center font-black text-xs text-white">
                        {user.name?.[0] || "U"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white tracking-tight">{user.name || "Unnamed User"}</div>
                        <div className="text-[10px] text-zinc-500 font-medium">ID: {user.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-[10px] text-zinc-400 font-bold tracking-tight">
                        <Mail size={10} className="mr-2 text-brand-blue" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-[10px] text-zinc-400 font-bold tracking-tight">
                        <Phone size={10} className="mr-2 text-brand-green" />
                        {user.phone || "No phone"}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-[10px] font-bold text-zinc-500">
                      <Calendar size={12} className="mr-2" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 rounded-lg bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
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
