import React from "react";
import { LayoutDashboard, Store, Users, BarChart, Settings, Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-zinc-900 border-r border-white/5 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-8 border-b border-white/5">
          <h1 className="text-xl font-black font-outfit uppercase tracking-tighter">
            PassFit <span className="text-brand-green italic">Admin</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 pt-6">
          {[
            { name: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
            { name: "Gym Moderation", icon: Store, href: "/admin/gyms" },
            { name: "User Management", icon: Users, href: "/admin/users" },
            { name: "Analytics", icon: BarChart, href: "/admin/analytics" },
            { name: "Settings", icon: Settings, href: "/admin/settings" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm",
                  isActive 
                    ? "bg-brand-green/10 text-brand-green shadow-lg shadow-brand-green/5" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-zinc-500 hover:text-red-400 text-sm font-bold">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-20 bg-zinc-900/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-lg font-bold font-outfit">Control Center</h2>
          <div className="flex items-center space-x-4">
            <button className="relative w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-brand-green rounded-full border-2 border-zinc-900" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center font-black text-xs text-white shadow-lg shadow-brand-blue/20">AD</div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
