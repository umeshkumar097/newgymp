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
    { label: "TOTAL PARTNERS", value: stats.totalGyms, icon: Store, color: "text-brand-green", bg: "bg-brand-green/10" },
    { label: "ACTIVE USERS", value: stats.activeUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "TOTAL REV SHARE", value: stats.revShare, icon: BarChart3, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "GROWTH", value: stats.growth, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 rounded-[3rem] p-8 space-y-4 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[80px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
            
            <div className="flex justify-between items-start relative z-10">
               <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-50 group-hover:scale-110 transition-transform duration-500", stat.bg, stat.color)}>
                  <stat.icon size={24} />
               </div>
               <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100">Live View</div>
            </div>
            
            <div className="relative z-10 space-y-1">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic mb-1">{stat.label}</div>
               <div className="text-4xl font-black text-slate-900 tracking-tighter italic">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation (Premium Light Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-[2.5rem] border border-slate-200/60 w-fit backdrop-blur-3xl shadow-inner shadow-slate-200/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-3 px-8 py-5 rounded-[1.8rem] transition-all text-xs font-black uppercase tracking-wider italic",
                activeTab === tab.id 
                  ? "bg-white text-slate-900 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100 scale-[1.02]" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              )}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={cn("ml-3 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black", 
                    activeTab === tab.id 
                      ? "bg-brand-green/10 text-brand-green" 
                      : "bg-slate-200/50 text-slate-400"
                )}>
                    {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {stats.waitTime && (
          <div className="px-8 py-5 rounded-[2rem] bg-amber-50/50 border border-amber-100/50 flex items-center space-x-4">
             <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <ShieldCheck size={20} />
             </div>
             <div>
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Avg Verification Speed</p>
                <p className="text-sm font-black text-slate-900 tracking-tight italic">{stats.waitTime}</p>
             </div>
          </div>
        )}
      </div>

      {/* Content Area (Premium Hub Container) */}
      <div className="min-h-[600px] bg-slate-50/30 border border-slate-100 rounded-[4.5rem] p-10 shadow-sm border-dashed backdrop-blur-sm">
        {activeTab === "VERIFICATION" && <VerificationDesk gyms={pendingGyms} waitTime={stats.waitTime} defaultOnboardingFee={defaultOnboardingFee} />}
        {activeTab === "ACTIVE" && <ActiveHubs gyms={[...activeGyms, ...suspendedGyms]} commissionRate={commissionRate} />}
        {activeTab === "LEDGER" && <PartnerLedger gyms={activeGyms} />}
      </div>
    </div>
  );
}
