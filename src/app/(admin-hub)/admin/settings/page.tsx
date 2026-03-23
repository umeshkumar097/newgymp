import React from "react";
import { Settings, Shield, Bell, Database, Globe, Lock, Save, Zap } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-12 font-outfit bg-[#0B0F19] -m-8 p-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Platform Settings</h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.1em]">Configure global platform parameters and security protocols</p>
        </div>
        <div className="flex items-center space-x-4">
           <button className="bg-white text-zinc-950 font-black px-10 py-5 rounded-[1.5rem] text-[10px] uppercase tracking-[0.2em] shadow-3xl flex items-center space-x-4 hover:bg-brand-green transition-all active:scale-95">
              <Save size={18} />
              <span>Commit Changes</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        {[
          { label: "System Status", value: "Operational", icon: Zap, status: "text-brand-green", detail: "LATENCY: 12ms • UPTIME: 99.9%" },
          { label: "Security Protocol", value: "AES-256 Active", icon: Shield, status: "text-brand-blue", detail: "SHIELDED • ENCRYPTED LAYER" },
          { label: "API Version", value: "v2.0.4-premium", icon: Database, status: "text-slate-500", detail: "STABLE • SYNCED TO MAIN" },
        ].map((item) => (
          <div key={item.label} className="p-10 rounded-[3rem] bg-zinc-900 border border-white/10 flex flex-col justify-between space-y-8 shadow-3xl hover:border-white/20 transition-all group hover:-translate-y-1 duration-500">
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-950 flex items-center justify-center border border-white/5 text-slate-500 shadow-2xl group-hover:text-white transition-colors">
                <item.icon size={24} />
              </div>
              <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-black text-slate-600 uppercase tracking-widest">ACTIVE</div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">{item.label}</div>
              <div className={`text-2xl font-black tracking-tight uppercase ${item.status}`}>{item.value}</div>
              <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] mt-3">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-[4rem] p-16 space-y-12 shadow-4xl mx-4">
        <div className="flex items-center space-x-6 border-b border-white/5 pb-8">
           <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
              <Globe size={28} className="text-brand-blue" />
           </div>
           <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Global <br/> Parameters</h3>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-1">Universal governance values</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 px-2">PLATFORM TAX / COMMISSION (%)</label>
            <div className="p-6 bg-zinc-950 border border-white/10 rounded-2xl group focus-within:border-brand-green/30 transition-all shadow-inner">
              <input type="text" defaultValue="15" className="bg-transparent border-none outline-none text-2xl font-black text-white w-full tracking-tighter" />
            </div>
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-2">EFFECTIVE IMMEDIATELY ON NEW BOOKINGS</p>
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 px-2">OPERATIONAL CURRENCY</label>
            <div className="p-6 bg-zinc-950 border border-white/10 rounded-2xl group focus-within:border-brand-blue/30 transition-all shadow-inner">
               <div className="flex items-center space-x-4">
                  <span className="text-2xl font-black text-brand-blue italic">₹</span>
                  <input type="text" defaultValue="INR" className="bg-transparent border-none outline-none text-2xl font-black text-white w-full tracking-tighter uppercase" />
               </div>
            </div>
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-2">LOCALIZATION SYMBOLS FOR VOUCHERS</p>
          </div>
        </div>

        <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-3xl p-10 flex items-start space-x-6">
           <Shield size={24} className="text-brand-blue shrink-0 mt-1" />
           <div className="space-y-2">
              <p className="text-[11px] font-black text-brand-blue uppercase tracking-[0.2em]">Security Protocol Warning</p>
              <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                 Changes to global commission rates will be broadcasted to all active gym partners via automated governance emails. Proceed with caution as this affects platform-wide financial settlement.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
