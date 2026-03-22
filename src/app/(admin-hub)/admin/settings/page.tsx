import React from "react";
import { Settings, Shield, Bell, Database, Globe, Lock, Save, Zap } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-12 font-outfit">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Platform Settings</h1>
        <p className="text-zinc-500 text-sm font-medium">Configure global platform parameters and security protocols</p>
      </div>

      <div className="space-y-6">
        {[
          { label: "System Status", value: "Operational", icon: Zap, status: "text-brand-green" },
          { label: "Security Protocol", value: "AES-256 Active", icon: Shield, status: "text-brand-blue" },
          { label: "API Version", value: "v2.0.4-premium", icon: Database, status: "text-zinc-500" },
        ].map((item) => (
          <div key={item.label} className="p-6 rounded-[2rem] bg-zinc-900/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center border border-white/5 text-zinc-400">
                <item.icon size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{item.label}</div>
                <div className={`text-sm font-bold tracking-tight ${item.status}`}>{item.value}</div>
              </div>
            </div>
            <button className="text-[10px] font-black text-brand-green uppercase tracking-widest hover:underline transition-all">Configure</button>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-10 space-y-8">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">Global Configurations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Platform Fee (%)</label>
            <div className="p-4 bg-zinc-950 border border-white/5 rounded-2xl">
              <input type="text" defaultValue="15" className="bg-transparent border-none outline-none text-white font-bold w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Currecy Symbol</label>
            <div className="p-4 bg-zinc-950 border border-white/5 rounded-2xl">
              <input type="text" defaultValue="₹" className="bg-transparent border-none outline-none text-white font-bold w-full" />
            </div>
          </div>
        </div>

        <button className="w-full bg-brand-green text-zinc-950 font-black py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-xs uppercase tracking-widest">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
