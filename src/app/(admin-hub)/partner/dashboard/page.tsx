import React from "react";
import { TrendingUp, Users, Wallet, CheckCircle2, Search, QrCode, Filter, ArrowUpRight, Clock, MapPin, Zap, ShieldCheck, AlertCircle, History } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { OtpVerification } from "@/components/partner/OtpVerification";
import { GymSetup } from "@/components/partner/GymSetup";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GymStatus, BookingStatus } from "@prisma/client";

export default async function PartnerDashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) redirect("/gym-login");

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || (user.role !== "GYM_OWNER" && user.role !== "ADMIN")) {
    redirect("/gym-login");
  }

  // Fetch Gym data & plans
  const gym = await prisma.gym.findFirst({
    where: { ownerId: user.id },
    include: {
      plans: true,
      bookings: {
        orderBy: { updatedAt: "desc" },
        include: { plan: true }
      }
    }
  });

  // If no gym, show the onboarding entry gate
  if (!gym) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-heading flex flex-col items-center justify-center p-6 space-y-12">
        <div className="w-24 h-24 rounded-[3rem] bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shadow-xl animate-bounce-subtle">
           <Zap size={48} className="fill-brand-green" />
        </div>
        
        <div className="text-center space-y-4 max-w-md">
           <h1 className="text-4xl font-extrabold uppercase tracking-tighter leading-none text-slate-900">Activate your <span className="text-brand-green">Hub</span></h1>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Your account is created! Now complete your gym profile and KYC to start accepting bookings.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
           {[
             { icon: MapPin, title: "Business Info", desc: "Location & Amenities" },
             { icon: ShieldCheck, title: "KYC Verification", desc: "PAN & Bank Proof" },
             { icon: Clock, title: "Operating Hours", desc: "Open/Close Times" },
             { icon: Wallet, title: "Pricing Plans", desc: "Set your Hub fees" }
           ].map((item, i) => (
             <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] flex items-center space-x-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                   <item.icon size={20} />
                </div>
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">{item.title}</h3>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>

        <Link 
          href="/partner/onboarding"
          className="bg-slate-900 text-white font-extrabold px-12 py-6 rounded-[2.5rem] text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all text-center"
        >
           Start Onboarding
        </Link>

        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Typical review time: &lt; 24 Hours</p>
      </div>
    );
  }
  
  // Check for Onboarding Fee (AWAITING_PAYMENT)
  if ((gym.status as any) === "AWAITING_PAYMENT") {
    redirect("/partner/checkout");
  }

  // Check for Under Review (PENDING)
  if ((gym.status as any) === "PENDING") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-10 font-sans">
         <div className="relative">
            <div className="w-24 h-24 rounded-[3rem] bg-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse border border-amber-500/20 shadow-xl">
               <Clock size={48} />
            </div>
            <div className="absolute -top-2 -right-2 bg-white p-2 rounded-full border border-slate-100 shadow-sm">
                <ShieldCheck size={16} className="text-slate-300" />
            </div>
         </div>
         
         <div className="space-y-4 max-w-sm">
            <h2 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tighter">Review in <span className="text-amber-500">Progress</span></h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                Our verification team is analyzing your KYC documents. We'll nudge you on WhatsApp as soon as we're done!
            </p>
         </div>

         <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Status</div>
               <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Scanning...</div>
            </div>
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
               <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Wait Time</div>
               <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">~24 Hours</div>
            </div>
         </div>

         <Link 
           href="/partner/onboarding"
           className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all underline underline-offset-8"
         >
            Edit Application
         </Link>
      </div>
    );
  }

  // Post-Approval Setup Check
  if (gym.imageUrls.length === 0 || gym.plans.length === 0) {
    return <GymSetup gymId={gym.id} />;
  }

  // Actual Stats Calculation
  const now = new Date();
  const gracePeriodEnd = (gym as any).commissionFreeUntil;
  const isGracePeriodActive = gracePeriodEnd ? now < gracePeriodEnd : false;
  const daysLeft = gracePeriodEnd 
    ? Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Ledger Logic (bookings verified after grace period)
  const taxableBookings = gym.bookings.filter(b => 
    (b.status as any) === "CHECKED_IN" && 
    (!gracePeriodEnd || b.updatedAt > gracePeriodEnd)
  );
  
  const commissionDue = taxableBookings.reduce((sum, b) => sum + (b.totalAmount * ((gym as any).baseCommissionRate || 15) / 100), 0);
  const todaysCheckins = gym.bookings.filter(b => 
    (b.status as any) === "CHECKED_IN" && 
    new Date(b.updatedAt).toDateString() === now.toDateString()
  ).length;

  return (
    <div className="pb-32 font-sans bg-white min-h-screen">
      
      {/* Grace Period Banner */}
      {isGracePeriodActive && (
        <div className="bg-slate-50 border-b border-slate-100 py-4 px-6 relative overflow-hidden">
           <div className="max-w-7xl mx-auto flex justify-between items-center group cursor-pointer">
              <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 rounded-lg bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green">
                    <Zap size={16} className="fill-brand-green" />
                 </div>
                 <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-900">
                    Grace Period Active: <span className="text-brand-green">{daysLeft} Days Left</span>
                 </p>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
                 <span>Enjoy 0% Commission on all bookings</span>
                 <ArrowUpRight size={10} />
              </div>
           </div>
        </div>
      )}

      <div className="p-6 max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex justify-between items-end pt-6">
           <div className="space-y-1">
              <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tighter">
                {gym.name.split(" ")[0]} <span className="text-brand-green">Hub</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{gym.location}</p>
           </div>
           <div className="flex space-x-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all cursor-pointer">
                 <History size={20} />
              </div>
           </div>
        </div>

        {/* The Magic Moment: Big OTP Search Box */}
        <div className="relative group">
           <div className="relative p-12 rounded-[3.5rem] bg-white border border-slate-100 space-y-10 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 text-slate-200">
                 <QrCode size={200} />
              </div>
              
              <div className="space-y-3 text-center md:text-left relative">
                 <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 mb-2">
                    <ShieldCheck size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">Smart Security Active</span>
                 </div>
                 <h2 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tighter leading-none">Enter Customer OTP</h2>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Verify the 4-digit code from the user's PassFit app</p>
              </div>

              <div className="max-w-xl">
                 <OtpVerification gymId={gym.id} />
              </div>
           </div>
        </div>

        {/* Stats & Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           {/* Ledger: PassFit Khata */}
           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm relative overflow-hidden min-h-[250px] flex flex-col justify-between">
              <div className="space-y-1">
                 <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                    <Wallet size={20} />
                 </div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">PassFit Khata (Ledger)</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none italic">Total Commission Due to PassFit</p>
              </div>
              
              <div className="space-y-6">
                 <div className="text-5xl font-extrabold tracking-tighter text-slate-900 uppercase">
                    ₹{commissionDue.toLocaleString()}
                 </div>
                 {commissionDue >= 2000 ? (
                    <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all">
                       Clear Due (Pay Now)
                    </button>
                 ) : (
                    <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <CheckCircle2 size={12} className="text-brand-green" />
                       <span>Below threshold (₹2,000)</span>
                    </div>
                 )}
              </div>
           </div>

           {/* Today's Walk-ins */}
           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm relative overflow-hidden min-h-[250px] flex flex-col justify-between">
              <div className="space-y-1">
                 <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-4">
                    <Users size={20} />
                 </div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Today's Walk-ins</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified entries from today</p>
              </div>

              <div className="space-y-1">
                 <div className="text-6xl font-extrabold text-slate-900 tracking-tighter">
                    {todaysCheckins.toString().padStart(2, '0')}
                 </div>
                 <div className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">Real-Time Sync</div>
              </div>
           </div>

           {/* Quick Support */}
           <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 space-y-6 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-300 border border-slate-100 mb-2">
                 <Users size={32} />
              </div>
              <div className="space-y-1">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Need Assistance?</h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Contact your dedicated account manager on WhatsApp
                 </p>
              </div>
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                 Chat Now
              </button>
           </div>
        </div>

        {/* Live Entries List */}
        <div className="space-y-6">
           <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tighter">
                Recent <span className="text-brand-green">Checked-in</span>
              </h2>
           </div>
           
           <div className="space-y-3">
              {gym.bookings.filter(b => (b.status as any) === "CHECKED_IN").slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="p-5 rounded-2xl bg-white border border-slate-100 flex justify-between items-center group hover:border-brand-green transition-all shadow-sm">
                   <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green">
                         <Zap size={18} className="fill-brand-green" />
                      </div>
                      <div>
                         <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest">User #{booking.id.substring(0, 6)}</div>
                         <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {new Date(booking.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Day Pass
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[11px] font-black text-slate-900">₹{booking.totalAmount}</div>
                      <div className="text-[8px] font-black text-brand-green uppercase tracking-widest mt-1">Verified ✅</div>
                   </div>
                </div>
              ))}
              
              {gym.bookings.filter(b => b.status === "CHECKED_IN").length === 0 && (
                <div className="p-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                   <AlertCircle size={40} className="text-slate-200" />
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No verified entries yet today</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
