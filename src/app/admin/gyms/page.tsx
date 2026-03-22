import React from "react";
import { Check, X, Eye, Clock, MapPin, ExternalLink, ShieldAlert, BarChart3, TrendingUp, Users, Store } from "lucide-react";
import Image from "next/image";
import { ModerationButtons } from "@/components/admin/ModerationButtons";
import { prisma } from "@/lib/prisma";

export default async function AdminGymsPage() {
  const gyms = await prisma.gym.findMany({
    where: { status: "PENDING" },
    include: { owner: true },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-outfit text-white">Pending Moderation</h1>
          <p className="text-zinc-500 text-sm font-medium">Approve or reject incoming gym partner applications.</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-4 flex items-center space-x-4 shadow-xl">
             <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Clock size={20} />
             </div>
             <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pending</div>
                <div className="text-xl font-black text-white">{gyms.length}</div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "Total Gyms", value: "48", icon: Store, trend: "+12%" },
          { label: "Active Users", value: "1.2k", icon: Users, trend: "+5%" },
          { label: "Rev Share", value: "₹45k", icon: BarChart3, trend: "+20%" },
          { label: "Growth", value: "24%", icon: TrendingUp, trend: "+8%" },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-4 hover:border-orange-500/30 transition-all cursor-default">
            <div className="flex justify-between items-start">
               <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <stat.icon size={20} />
               </div>
               <div className="px-2 py-0.5 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-bold">{stat.trend}</div>
            </div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</div>
               <div className="text-2xl font-black text-white">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Gym Name</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Owner</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Location</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {gyms.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center space-y-4 opacity-30">
                    <ShieldAlert size={48} strokeWidth={1} />
                    <p className="text-sm font-bold uppercase tracking-widest">No pending applications</p>
                  </div>
                </td>
              </tr>
            ) : (
              gyms.map((gym: any) => (
                <tr key={gym.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 overflow-hidden">
                          {gym.imageUrls[0] ? <Image src={gym.imageUrls[0]} alt="" width={48} height={48} className="object-cover" /> : <Store size={20} className="text-zinc-600" />}
                       </div>
                       <div>
                          <div className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">{gym.name}</div>
                          <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">ID: {gym.id.substring(0, 8)}</div>
                       </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div>
                       <div className="text-sm font-bold text-zinc-300">{gym.owner.name || "Unnamed Owner"}</div>
                       <div className="text-[10px] font-medium text-zinc-600">{gym.owner.email}</div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center text-xs font-bold text-zinc-500 uppercase tracking-tighter">
                       <MapPin size={12} className="mr-1.5 text-orange-500/50" />
                       {gym.location}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-lg bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                       {gym.status}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <ModerationButtons gymId={gym.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
