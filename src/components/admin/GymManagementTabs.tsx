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
import { ShieldCheck, BarChart3, Store, Users, TrendingUp } from "lucide-react";

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
    { id: "VERIFICATION", label: "Verification Desk", icon: ShieldCheck, count: pendingGyms.length },
    { id: "ACTIVE", label: "Active Hubs", icon: Store, count: activeGyms.length },
    { id: "LEDGER", label: "Partner Ledger", icon: BarChart3 },
  ];

  const statCards = [
    { label: "TOTAL PARTNERS", value: stats.totalGyms, icon: Store, color: "text-brand-green", bg: "bg-brand-green/5" },
    { label: "ACTIVE USERS", value: stats.activeUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/5" },
    { label: "TOTAL REV SHARE", value: stats.revShare, icon: BarChart3, color: "text-amber-500", bg: "bg-amber-500/5" },
    { label: "GROWTH", value: stats.growth, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/5" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      
      {/* Refined Stats Grid (Less Bubbly) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-5 hover:shadow-xl hover:shadow-slate-200/40 transition-all group relative overflow-hidden ring-1 ring-slate-50">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[80px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
            
            <div className="flex justify-between items-start relative z-10">
               <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border border-slate-50 group-hover:scale-110 transition-transform duration-500 shadow-sm", stat.bg, stat.color)}>
                  <stat.icon size={20} />
               </div>
               <div className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-300 text-[9px] font-black uppercase tracking-widest border border-slate-100">Live Metric</div>
            </div>
            
            <div className="relative z-10 space-y-1">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{stat.label}</div>
               <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation (Sophisticated Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center space-x-2 bg-white p-2 rounded-[1.8rem] border border-slate-200/60 w-fit shadow-sm ring-1 ring-slate-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200/60 scale-[1.02]" 
                  : "text-slate-500 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              <tab.icon size={16} className={cn(activeTab === tab.id ? "text-brand-green" : "text-slate-400")} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={cn("ml-2 w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black leading-none", 
                    activeTab === tab.id 
                      ? "bg-brand-green text-slate-950 shadow-sm" 
                      : "bg-slate-100 text-slate-400"
                )}>
                    {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {stats.waitTime && (
          <div className="px-6 py-4 rounded-[1.5rem] bg-white border border-slate-100 flex items-center space-x-4 shadow-sm">
             <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                <ShieldCheck size={18} />
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Verification Speed</p>
                <p className="text-sm font-black text-slate-900 tracking-tight tabular-nums">{stats.waitTime}</p>
             </div>
          </div>
        )}
      </div>

      {/* Content Area (Sophisticated Container) */}
      <div className="min-h-[600px] bg-white/50 border border-slate-200/60 rounded-[2.5rem] p-10 shadow-sm backdrop-blur-sm relative overflow-hidden transition-all duration-700">
        <div className="relative z-10">
           {activeTab === "VERIFICATION" && <VerificationDesk gyms={pendingGyms} waitTime={stats.waitTime} defaultOnboardingFee={defaultOnboardingFee} />}
           {activeTab === "ACTIVE" && <ActiveHubs gyms={[...activeGyms, ...suspendedGyms]} commissionRate={commissionRate} />}
           {activeTab === "LEDGER" && <PartnerLedger gyms={activeGyms} />}
        </div>
        
        {/* Subtle Gradient Fog */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-[100px] -mr-32 -mt-32 pointer-events-none opacity-50" />
      </div>
    </div>
  );
}
