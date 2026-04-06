import React from "react";
import { Ticket, ArrowRight, MapPin, Calendar, QrCode, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function PassesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth");
  }

  const activeBookings = await prisma.booking.findMany({
    where: { 
      userId: (session.user as any).id,
      status: { in: ["BOOKED", "CHECKED_IN"] }
    },
    include: { gym: true, plan: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto w-full px-6 py-12 space-y-12 pb-32">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20">
             <Ticket size={12} className="text-brand-green" />
             <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">My Access Passes</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold font-heading text-slate-900 leading-none tracking-tighter uppercase">My Hubs</h1>
          <p className="text-slate-500 text-sm font-medium">Track your active elite fitness hub bookings</p>
        </div>

        {/* Layout for Grid */}
        {activeBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-8 py-24 text-center bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-slate-300 border border-slate-100 shadow-sm">
              <Ticket size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">No active passes</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">Ready for a workout? Your booked passes will appear here for instant hub access.</p>
            </div>
            <Link href="/" className="bg-slate-900 text-white font-extrabold py-4 px-10 rounded-full shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center space-x-3 group">
              <span>Find a Gym</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activeBookings.map((booking) => (
              <Link 
                key={booking.id} 
                href={`/bookings/${booking.id}/success`}
                className="block group"
              >
                <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:border-brand-green transition-all shadow-xl shadow-slate-200/50 hover:shadow-brand-green/10">
                  <div className="p-8 space-y-8">
                    {/* Status & Date */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                        <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">
                          {booking.status === "BOOKED" ? "Ready to use" : "Active Now"}
                        </span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                        <Calendar size={12} className="mr-2" />
                        {new Date(booking.bookingDates[0] || booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {booking.bookingDates.length > 1 && ` + ${booking.bookingDates.length - 1} more`}
                      </div>
                    </div>

                    {/* Gym Details */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-extrabold font-heading text-slate-900 group-hover:text-brand-green transition-colors uppercase tracking-tight leading-none">{booking.gym.name}</h3>
                        <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          <MapPin size={10} className="mr-2 text-brand-blue" />
                          {booking.gym.location}
                        </div>
                      </div>
                      
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center shadow-inner">
                         <div>
                            <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Access OTP</span>
                            <span className="text-3xl font-extrabold text-slate-900 tracking-[0.3em] font-heading">{booking.otp}</span>
                         </div>
                         <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                            <QrCode size={24} />
                         </div>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                      <div className="flex space-x-6">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-300 uppercase mb-1">Pass Type</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                             <Zap size={10} className="mr-1 text-brand-green" />
                             {booking.plan.type}
                          </span>
                        </div>
                        <div className="w-px h-8 bg-slate-100" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-300 uppercase mb-1">Payment</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                             <ShieldCheck size={10} className="mr-1 text-brand-blue" />
                             PAY AT GYM
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-green group-hover:text-white transition-all transform group-hover:rotate-12 group-hover:shadow-lg">
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
