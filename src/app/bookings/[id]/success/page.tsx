import React from "react";
import Link from "next/link";
import { CheckCircle2, QrCode, Download, Share2, MapPin, Calendar, Clock, ArrowRight, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { VoucherDownloadButton } from "@/components/bookings/VoucherDownloadButton";

// We'll use a mock QR generator for now, but in reality, we'd use 'qrcode' package
// For now, I'll just use a placeholder image or a div that looks like a QR code

export default async function BookingSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const booking = await prisma.booking.findUnique({
    where: { id: resolvedParams.id },
    include: { gym: true, plan: true }
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 p-6 space-y-8 pb-32">
      {/* Success Indicator */}
      <div className="flex flex-col items-center text-center space-y-4 pt-8">
        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 shadow-2xl shadow-green-500/10 animate-pulse">
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-outfit text-white leading-tight tracking-tighter">Booking Confirmed!</h1>
          <p className="text-zinc-500 text-sm font-medium">Your pass is ready. Please complete payment at the gym reception.</p>
        </div>
      </div>

      {/* Main Voucher Card */}
      <div className="relative bg-zinc-900 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
        {/* Top Gradient & Cutouts */}
        <div className="h-32 bg-gradient-to-br from-orange-500 to-orange-600 p-8 flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Booking ID</div>
            <div className="font-mono text-xs font-bold text-white tabular-nums">#{booking.id.substring(0, 12).toUpperCase()}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Download size={20} className="text-white" />
          </div>
        </div>

        {/* Gym Info */}
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-black font-outfit text-white">{booking.gym.name}</h2>
              <div className="flex items-center text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <MapPin size={10} className="mr-1 text-orange-500" />
                {booking.gym.location}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Plan Type</div>
              <div className="text-sm font-black text-orange-500 uppercase tracking-tight">{booking.plan.type} PASS</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 py-6 border-y border-zinc-800/50">
            <div className="space-y-1">
              <div className="flex items-center text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
                <Calendar size={10} className="mr-1" />
                Date
              </div>
              <div className="text-sm font-bold text-white">
                {new Date(booking.bookingDates[0] || booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {booking.bookingDates.length > 1 && <span className="text-orange-500 ml-1">+{booking.bookingDates.length - 1} Days</span>}
              </div>
            </div>
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
                <Clock size={10} className="mr-1" />
                OTP
              </div>
              <div className="text-2xl font-black text-white tracking-widest tabular-nums">{booking.otp}</div>
            </div>
            <div className="space-y-1 text-right">
              <div className="flex items-center justify-end text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
                <Zap size={10} className="mr-1" />
                To Pay
              </div>
              <div className="text-xl font-black text-orange-500 tracking-tight">₹{booking.totalAmount}</div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center space-y-4 pt-4">
            <div className="relative p-6 bg-white rounded-3xl shadow-inner border-[12px] border-zinc-800">
              {/* Mock QR components */}
              <div className="w-32 h-32 grid grid-cols-4 grid-rows-4 gap-2 opacity-80">
                {[...Array(16)].map((_, i) => (
                   <div key={i} className={`rounded-[2px] ${Math.random() > 0.5 ? 'bg-zinc-950' : 'bg-transparent'}`} />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center p-1 border border-zinc-100">
                  <div className="w-full h-full bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-[8px] font-black text-white italic">PF</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Scan at Reception for Entry</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-4">
        <VoucherDownloadButton booking={booking} />
        <button className="w-full bg-zinc-900 border border-white/5 text-white font-black py-5 rounded-[2.5rem] shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest">
          <Share2 size={18} />
          <span>Share Voucher</span>
        </button>
        <Link href="/" className="w-full py-4 text-center text-zinc-600 font-bold text-xs uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center justify-center">
          Go back to Home
          <ArrowRight size={14} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
