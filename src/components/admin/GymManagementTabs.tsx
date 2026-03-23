"use client";

import React, { useState } from "react";
import { 
  VerificationDesk 
} from "./sections/VerificationDesk";
import { 
  ActiveHubs 
} from "./sections/ActiveHubs";
import { 
  PartnerLedger 
} from "./sections/PartnerLedger";
import { cn } from "@/lib/utils";
import { ShieldCheck, Zap, BarChart3, Clock, Store, Users, TrendingUp } from "lucide-react";

interface GymManagementTabsProps {
  pendingGyms: any[];
  activeGyms: any[];
  suspendedGyms: any[];
  stats: {
    totalGyms: string;
    activeUsers: string;
    revShare: string;
    growth: string;
    waitTime?: string;
  };
  commissionRate?: number;
  defaultOnboardingFee?: number;
}

export function GymManagementTabs({ 
  pendingGyms, 
  activeGyms, 
  suspendedGyms,
  stats,
  commissionRate = 15,
  defaultOnboardingFee = 4999
}: GymManagementTabsProps) {
  const [activeTab, setActiveTab] = useState<"VERIFICATION" | "ACTIVE" | "LEDGER">("VERIFICATION");

  const tabs = [
    { id: "VERIFICATION", label: "Verification Desk", icon: ShieldCheck, count: pendingGyms.length, color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: "ACTIVE", label: "Active Hubs", icon: Store, count: activeGyms.length, color: "text-brand-green", bg: "bg-brand-green/10" },
    { id: "LEDGER", label: "Partner Ledger", icon: BarChart3, color: "text-brand-blue", bg: "bg-brand-blue/10" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "TOTAL PARTNERS", value: stats.totalGyms, icon: Store, trend: "+2.5%", color: "text-brand-green" },
          { label: "ACTIVE USERS", value: stats.activeUsers, icon: Users, trend: "+4.1%", color: "text-brand-blue" },
          { label: "TOTAL REV SHARE", value: stats.revShare, icon: BarChart3, trend: "+12.2%", color: "text-orange-500" },
          { label: "NETWORK GROWTH", value: stats.growth, icon: TrendingUp, trend: "+8%", color: "text-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 space-y-4 hover:border-white/20 transition-all shadow-2xl group cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start relative z-10">
               <div className={cn("w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform", stat.color)}>
                  <stat.icon size={22} />
               </div>
               <div className="px-3 py-1 rounded-xl bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-white/5">{stat.trend}</div>
            </div>
            <div className="relative z-10">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</div>
               <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-3 bg-zinc-900 p-2 rounded-[2rem] border border-white/10 w-fit shadow-3xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-wider",
              activeTab === tab.id 
                ? "bg-white text-zinc-950 shadow-2xl scale-[1.02]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
               <span className={cn("ml-3 px-2 py-0.5 rounded-lg flex items-center justify-center text-[10px] font-black border", 
                  activeTab === tab.id 
                    ? "bg-zinc-950 text-white border-white/10" 
                    : "bg-zinc-950/50 text-slate-500 border-white/5"
               )}>
                  {tab.count}
               </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Area */}
      <div className="min-h-[500px] bg-zinc-900/40 border border-white/10 rounded-[3.5rem] p-8 shadow-3xl border-dashed">
        {activeTab === "VERIFICATION" && <VerificationDesk gyms={pendingGyms} waitTime={stats.waitTime} defaultOnboardingFee={defaultOnboardingFee} />}
        {activeTab === "ACTIVE" && <ActiveHubs gyms={[...activeGyms, ...suspendedGyms]} commissionRate={commissionRate} />}
        {activeTab === "LEDGER" && <PartnerLedger gyms={activeGyms} />}
      </div>
    </div>
  );
}
