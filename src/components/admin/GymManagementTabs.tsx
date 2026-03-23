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
}

export function GymManagementTabs({ 
  pendingGyms, 
  activeGyms, 
  suspendedGyms,
  stats 
}: GymManagementTabsProps) {
  const [activeTab, setActiveTab] = useState<"VERIFICATION" | "ACTIVE" | "LEDGER">("VERIFICATION");

  const tabs = [
    { id: "VERIFICATION", label: "Verification Desk", icon: ShieldCheck, count: pendingGyms.length, color: "text-orange-500", bg: "bg-orange-500/10" },
    { id: "ACTIVE", label: "Active Hubs", icon: Store, count: activeGyms.length, color: "text-brand-green", bg: "bg-brand-green/10" },
    { id: "LEDGER", label: "Partner Ledger", icon: BarChart3, color: "text-brand-blue", bg: "bg-brand-blue/10" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Partners", value: stats.totalGyms, icon: Store, trend: "+2.5%", color: "text-brand-green" },
          { label: "Active Users", value: stats.activeUsers, icon: Users, trend: "+4.1%", color: "text-brand-blue" },
          { label: "Total Rev Share", value: stats.revShare, icon: BarChart3, trend: "+12.2%", color: "text-orange-500" },
          { label: "Network Growth", value: stats.growth, icon: TrendingUp, trend: "+8%", color: "text-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4 hover:border-white/10 transition-all shadow-xl group cursor-default">
            <div className="flex justify-between items-start">
               <div className={cn("w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-slate-700", stat.color)}>
                  <stat.icon size={20} />
               </div>
               <div className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-500 text-[10px] font-bold">{stat.trend}</div>
            </div>
            <div>
               <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
               <div className="text-3xl font-extrabold font-heading text-white mt-1 uppercase tracking-tighter">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-3xl border border-white/5 w-fit shadow-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center space-x-3 px-6 py-3.5 rounded-2xl transition-all text-xs font-bold uppercase tracking-wider",
              activeTab === tab.id 
                ? "bg-white text-[#0F172A] shadow-xl scale-[1.02]" 
                : "text-slate-500 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
               <span className={cn("ml-2 w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black", 
                  activeTab === tab.id ? "bg-[#0F172A] text-white" : "bg-slate-800 text-slate-400"
               )}>
                  {tab.count}
               </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Area */}
      <div className="min-h-[400px]">
        {activeTab === "VERIFICATION" && <VerificationDesk gyms={pendingGyms} waitTime={stats.waitTime} />}
        {activeTab === "ACTIVE" && <ActiveHubs gyms={[...activeGyms, ...suspendedGyms]} />}
        {activeTab === "LEDGER" && <PartnerLedger gyms={activeGyms} />}
      </div>
    </div>
  );
}
