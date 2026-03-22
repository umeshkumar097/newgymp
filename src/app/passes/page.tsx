import React from "react";
import { Ticket, History, Clock, ArrowRight, MapPin, Calendar, QrCode, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function PassesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const user = userId 
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null;
    
  if (!user) {
    redirect("/auth");
  }

  const activeBookings = user ? await prisma.booking.findMany({
    where: { 
      userId: user.id,
      status: { in: ["BOOKED", "CHECKED_IN"] }
    },
    include: { gym: true, plan: true },
    orderBy: { createdAt: "desc" }
  }) : [];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto w-full px-6 py-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20">
             <Ticket size={12} className="text-brand-green" />
             <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">My Access Passes</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-outfit text-white leading-none tracking-tighter uppercase">Passes</h1>
          <p className="text-zinc-500 text-sm font-medium">Track your active and past gym bookings</p>
        </div>

        {/* Layout for Grid */}
        {activeBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-8 py-20 text-center bg-zinc-900/40 rounded-[3rem] border border-white/5">
            <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700 border border-white/5 shadow-2xl">
              <Ticket size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">No active passes</h2>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">Ready for a workout? Your booked passes will appear here for easy access.</p>
            </div>
            <Link href="/" className="bg-gradient-to-r from-brand-blue to-brand-green text-white font-black py-4 px-10 rounded-full shadow-2xl shadow-brand-blue/20 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center space-x-3">
              <span>Find a Gym</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeBookings.map((booking) => (
              <Link 
                key={booking.id} 
                href={`/bookings/${booking.id}/success`}
                className="block group"
              >
                <div className="bg-zinc-900/60 rounded-[3rem] border border-white/5 overflow-hidden hover:border-brand-green/30 transition-all shadow-xl hover:shadow-brand-green/5">
                  <div className="p-8 space-y-8">
                    {/* Status & Date */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-green/20 border border-brand-green/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                        <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">
                          {booking.status === "BOOKED" ? "Ready to use" : "Active Now"}
                        </span>
                      </div>
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center">
                        <Calendar size={12} className="mr-2" />
                        {new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>

                    {/* Gym Details */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black font-outfit text-white group-hover:text-brand-green transition-colors uppercase tracking-tight leading-none">{booking.gym.name}</h3>
                        <div className="flex items-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                          <MapPin size={10} className="mr-2 text-brand-blue" />
                          {booking.gym.location}
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 flex justify-between items-center">
                         <div>
                            <span className="text-[8px] font-black text-zinc-700 uppercase block mb-1">Access OTP</span>
                            <span className="text-2xl font-black text-white tracking-[0.3em] font-outfit">{booking.otp}</span>
                         </div>
                         <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                            <QrCode size={24} />
                         </div>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <div className="flex space-x-6">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-zinc-700 uppercase mb-1">Pass Type</span>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center">
                             <Zap size={10} className="mr-1 text-brand-green" />
                             {booking.plan.type}
                          </span>
                        </div>
                        <div className="w-px h-8 bg-white/5" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-zinc-700 uppercase mb-1">Payment</span>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center">
                             <ShieldCheck size={10} className="mr-1 text-brand-blue" />
                             PAY AT GYM
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:bg-brand-green group-hover:text-white transition-all transform group-hover:rotate-12">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
