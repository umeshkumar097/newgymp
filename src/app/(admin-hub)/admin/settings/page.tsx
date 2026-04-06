"use client";

import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Shield, Bell, Database, Globe, Lock, Save, Zap, Loader2 } from "lucide-react";
import { getPlatformSettings, updatePlatformSetting } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [isPending, setIsPending] = useState(false);
  const [tax, setTax] = useState("15");
  const [currency, setCurrency] = useState("INR");
  const [onboardingFee, setOnboardingFee] = useState("4999");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const settings = await getPlatformSettings();
      const taxSetting = settings.find((s: any) => s.key === "COMMISSION_RATE");
      const currencySetting = settings.find((s: any) => s.key === "OPERATIONAL_CURRENCY");
      const feeSetting = settings.find((s: any) => s.key === "DEFAULT_ONBOARDING_FEE");
      
      if (taxSetting) setTax(taxSetting.value);
      if (currencySetting) setCurrency(currencySetting.value);
      if (feeSetting) setOnboardingFee(feeSetting.value);
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsPending(true);
    try {
      await Promise.all([
        updatePlatformSetting("COMMISSION_RATE", tax),
        updatePlatformSetting("OPERATIONAL_CURRENCY", currency),
        updatePlatformSetting("DEFAULT_ONBOARDING_FEE", onboardingFee)
      ]);
      alert("Platform settings updated successfully");
    } catch (error) {
      alert("Failed to update settings");
    } finally {
      setIsPending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-green" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Settings</h1>
          <p className="text-slate-500 text-sm font-medium">Configure global platform parameters and security.</p>
        </div>
        <div className="flex items-center space-x-4">
           <button 
             disabled={isPending}
             onClick={handleSave}
             className="bg-slate-900 text-white font-black px-10 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center space-x-4 hover:bg-brand-green hover:text-slate-950 transition-all active:scale-95 disabled:opacity-50 border border-slate-800"
           >
              {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>{isPending ? "Syncing..." : "Save Configuration"}</span>
           </button>
        </div>
      </div>

      {/* Stats/Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {[
          { label: "Platform Status", value: "Operational", icon: Zap, status: "text-brand-green", detail: "LATENCY: 12ms • UPTIME: 99.9%", bg: "bg-green-50" },
          { label: "Security", value: "AES-256", icon: Shield, status: "text-brand-blue", detail: "SHIELDED • ENCRYPTED LAYER", bg: "bg-blue-50" },
          { label: "Registry Sync", value: "Stable", icon: Database, status: "text-slate-500", detail: "STABLE • SYNCED TO MAIN", bg: "bg-slate-100" },
        ].map((item) => (
          <div key={item.label} className="p-10 rounded-[3rem] bg-white border border-slate-200/60 flex flex-col justify-between space-y-8 shadow-sm hover:border-slate-300 transition-all group">
            <div className="flex items-start justify-between">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm transition-colors", item.bg)}>
                <item.icon size={24} className={item.status} />
              </div>
              <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">{item.label}</div>
              <div className={cn("text-2xl font-black tracking-tight uppercase", item.status)}>{item.value}</div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Governance Block */}
      <div className="bg-white border border-slate-200/60 rounded-[4rem] p-16 space-y-12 shadow-sm mx-4">
        <div className="flex items-center space-x-6 border-b border-slate-50 pb-8">
           <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
              <Globe size={28} className="text-brand-blue" />
           </div>
           <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Platform Governance</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Universal parameter control</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">COMMISSION RATE (%)</label>
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group focus-within:border-brand-green/30 transition-all shadow-inner">
              <input 
                type="text" 
                value={tax} 
                onChange={(e) => setTax(e.target.value)}
                className="bg-transparent border-none outline-none text-2xl font-black text-slate-900 w-full tracking-tighter" 
              />
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 leading-relaxed">Applied to all future hub transactions</p>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">OPERATIONAL CURRENCY</label>
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group focus-within:border-brand-blue/30 transition-all shadow-inner">
               <div className="flex items-center space-x-4">
                  <span className="text-2xl font-black text-brand-blue">{currency === "INR" ? "₹" : "$"}</span>
                  <input 
                    type="text" 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    className="bg-transparent border-none outline-none text-2xl font-black text-slate-900 w-full tracking-tighter uppercase" 
                  />
               </div>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 leading-relaxed">Regional localization for vouchers</p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">ONBOARDING FEE</label>
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl group focus-within:border-orange-400/30 transition-all shadow-inner">
               <div className="flex items-center space-x-4">
                  <span className="text-2xl font-black text-orange-500">₹</span>
                  <input 
                    type="text" 
                    value={onboardingFee} 
                    onChange={(e) => setOnboardingFee(e.target.value)}
                    className="bg-transparent border-none outline-none text-2xl font-black text-slate-900 w-full tracking-tighter uppercase" 
                  />
               </div>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 leading-relaxed">Default cost for new hub activation</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-10 flex items-start space-x-6">
           <Shield size={24} className="text-slate-300 shrink-0 mt-1" />
           <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Security Advisory</p>
              <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-tight">
                 Changes to platform parameters will take effect immediately. Ensure you have coordinated with the financial department before committing changes to commission structures.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
