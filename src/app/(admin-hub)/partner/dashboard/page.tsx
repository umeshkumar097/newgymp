import { TrendingUp, Users, Wallet, CheckCircle2, Search, QrCode, Filter, ArrowUpRight, Clock, MapPin, Zap, ShieldCheck, AlertCircle, History, MessageSquare, Check, ArrowRight } from "lucide-react";
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

  if (!userId) redirect("/partner/login");

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || (user.role !== "GYM_OWNER" && user.role !== "ADMIN")) {
    redirect("/partner/login");
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

  // If no gym, show the onboarding entry gate (Premium Light Overhaul)
  if (!gym) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col items-center justify-center p-8 space-y-16 selection:bg-brand-green/20">
        <div className="relative">
            <div className="w-32 h-32 rounded-[4rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-2xl animate-bounce-subtle outline outline-8 outline-slate-50/50">
               <Zap size={56} className="fill-brand-green text-brand-green" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-brand-green text-white p-3 rounded-2xl shadow-xl border-4 border-white">
                <Check size={20} strokeWidth={4} />
            </div>
        </div>
        
        <div className="text-center space-y-6 max-w-xl">
           <h1 className="text-6xl font-black uppercase tracking-tighter leading-none italic text-slate-900">
              Activate your <span className="text-brand-green">Hub</span>
           </h1>
           <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em] leading-relaxed italic">
              Your partner account is live! Now activate your physical hub to start accepting premium walk-ins.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
           {[
             { icon: MapPin, title: "Elite Location", desc: "Pinpoint your Hub" },
             { icon: ShieldCheck, title: "Secure KYC", desc: "Identity Verification" },
             { icon: Clock, title: "Peak Hours", desc: "Set Access Times" },
             { icon: Wallet, title: "Yield Tuning", desc: "Configure Pricing" }
           ].map((item, i) => (
             <div key={i} className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex items-center space-x-6 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-500 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-brand-green transition-colors shadow-sm">
                   <item.icon size={24} />
                </div>
                <div className="space-y-1">
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">{item.title}</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>

        <Link 
          href="/partner/onboarding"
          className="bg-slate-900 text-white font-black px-16 py-8 rounded-[3rem] text-xs uppercase tracking-[0.5em] shadow-3xl shadow-slate-200 hover:scale-[1.05] active:scale-95 transition-all text-center group flex items-center space-x-4"
        >
           <span>Begin Onboarding</span>
           <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </Link>

        <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em]">Global Hub Network v4.0</p>
      </div>
    );
  }
  
  // Check for Onboarding Fee (AWAITING_PAYMENT)
  if ((gym.status as any) === "AWAITING_PAYMENT") {
    redirect("/partner/checkout");
  }

  // Check for Under Review (PENDING) (Premium Light Overhaul)
  if ((gym.status as any) === "PENDING") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-12 font-sans selection:bg-brand-green/20">
         <div className="relative">
            <div className="w-32 h-32 rounded-[4rem] bg-amber-500/5 flex items-center justify-center text-amber-500 animate-pulse border border-amber-500/10 shadow-3xl outline outline-8 outline-amber-50/30">
               <Clock size={56} />
            </div>
            <div className="absolute -top-2 -right-2 bg-white p-3 rounded-full border border-slate-100 shadow-xl">
                <ShieldCheck size={20} className="text-slate-200" />
            </div>
         </div>
         
         <div className="space-y-6 max-w-lg">
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic">Review in <span className="text-amber-500">Progress</span></h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed italic">
                Our verification elite team is scanning your documentation. You will receive an official hub nudge via email shortly.
            </p>
         </div>

         <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-center shadow-sm">
               <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Protocol</div>
               <div className="text-[11px] font-black text-amber-600 uppercase tracking-widest italic">Scanning Auth...</div>
            </div>
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-center shadow-sm">
               <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Estimated Window</div>
               <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">Under 24H</div>
            </div>
         </div>

         <Link 
           href="/partner/onboarding"
           className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] hover:text-slate-900 transition-all underline underline-offset-[12px] decoration-slate-200 hover:decoration-brand-green"
         >
            Update Application Data
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
    <div className="pb-32 font-sans bg-white min-h-screen selection:bg-brand-green/20">
      
      {/* Grace Period Banner (Premium Overhaul) */}
      {isGracePeriodActive && (
        <div className="bg-slate-900 py-4 px-8 relative overflow-hidden">
           <div className="max-w-7xl mx-auto flex justify-between items-center group cursor-pointer relative z-10">
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-slate-900 shadow-xl shadow-brand-green/20">
                    <Zap size={20} className="fill-slate-900" />
                 </div>
                 <p className="text-[11px] md:text-sm font-black uppercase tracking-[0.3em] text-white italic">
                    Launch Privilege Active: <span className="text-brand-green">{daysLeft} Days of 0% Fees</span>
                 </p>
              </div>
              <div className="hidden md:flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                 <span className="opacity-60">Maximise your hub yield today</span>
                 <CheckCircle2 size={12} className="text-brand-green" />
              </div>
           </div>
           {/* Subtle background glow */}
           <div className="absolute top-0 right-0 w-64 h-full bg-brand-green/10 blur-[60px] -translate-y-1/2" />
        </div>
      )}

      <div className="p-8 max-w-6xl mx-auto space-y-16">
        
        {/* Header Section (Premium Alignment) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-8 space-y-6 md:space-y-0">
           <div className="space-y-2">
              <div className="flex items-center space-x-3 text-slate-300 mb-1">
                 <MapPin size={14} />
                 <span className="text-[9px] font-black uppercase tracking-[0.4em]">{gym.location}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                {gym.name.split(" ")[0]} <span className="text-brand-green underline decoration-slate-100 underline-offset-8">Hub</span>
              </h1>
           </div>
           
           <div className="flex items-center space-x-4">
              <div className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3 group cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-500">
                 <div className="w-4 h-4 rounded-full bg-brand-green animate-pulse shadow-lg shadow-brand-green/30" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Hub Online</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white hover:rotate-12 transition-all cursor-pointer shadow-sm">
                 <History size={24} />
              </div>
           </div>
        </div>

        {/* Hero: Safe Entry OTP (Premium Alignment) */}
        <div className="relative group">
           <div className="relative p-12 md:p-20 rounded-[4rem] bg-slate-50/50 border border-slate-100/50 space-y-16 shadow-2xl shadow-slate-200/20 overflow-hidden backdrop-blur-3xl outline outline-8 outline-slate-50/30">
              
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] -rotate-12 text-slate-900 pointer-events-none">
                 <QrCode size={340} />
              </div>
              
              <div className="space-y-4 text-center md:text-left relative">
                 <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white text-slate-900 border border-slate-100 shadow-sm mb-2">
                    <ShieldCheck size={14} className="text-brand-green" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] leading-none">Encrypted Access Port</span>
                 </div>
                 <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">Verified <span className="text-brand-green">Entry</span></h2>
                 <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] italic">Validate 4-digit code from user's elite pass</p>
              </div>

              <div className="max-w-xl relative">
                 <OtpVerification gymId={gym.id} />
              </div>
           </div>
        </div>

        {/* Stats Grid (High Premium Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           
           {/* Ledger: PassFit Khata */}
           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 shadow-3xl shadow-slate-200/10 relative overflow-hidden group hover:border-brand-green/30 transition-all duration-700 min-h-[300px] flex flex-col justify-between">
              <div className="space-y-2">
                 <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Wallet size={24} />
                 </div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">PassFit Ledger</h3>
                 <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Pending Settlements</h4>
              </div>
              
              <div className="space-y-6">
                 <div className="text-6xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                    ₹{commissionDue.toLocaleString()}
                 </div>
                 {commissionDue >= 2000 ? (
                    <button className="w-full bg-slate-900 text-white font-black py-6 rounded-[1.8rem] text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                       Audit & Clear (Pay)
                    </button>
                 ) : (
                    <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 p-4 rounded-xl">
                       <CheckCircle2 size={16} className="text-brand-green" />
                       <span>Below audit threshold (₹2k)</span>
                    </div>
                 )}
              </div>
           </div>

           {/* Today's Walk-ins */}
           <div className="bg-white border border-slate-100 rounded-[3rem] p-10 space-y-8 shadow-3xl shadow-slate-200/10 relative overflow-hidden group hover:border-brand-green/30 transition-all duration-700 min-h-[300px] flex flex-col justify-between">
              <div className="space-y-2">
                 <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-6 group-hover:scale-110 transition-transform duration-500 border border-brand-green/20">
                    <Users size={24} />
                 </div>
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Traffic Control</h3>
                 <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">Live Walk-ins Today</h4>
              </div>

              <div className="space-y-2">
                 <div className="text-7xl font-black text-slate-900 tracking-tighter leading-none italic">
                    {todaysCheckins.toString().padStart(2, '0')}
                 </div>
                 <div className="flex items-center space-x-2 text-[10px] font-black text-brand-green uppercase tracking-[0.4em]">
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
                    <span>Real-time Pulse active</span>
                 </div>
              </div>
           </div>

           {/* Support Channel (Professional Layout) */}
           <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-10 space-y-10 flex flex-col justify-center items-center text-center group hover:bg-slate-900 hover:border-slate-900 transition-all duration-700">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-300 border border-slate-100 shadow-xl group-hover:bg-brand-green group-hover:text-slate-900 transition-colors duration-500">
                 <MessageSquare size={36} />
              </div>
              <div className="space-y-3">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest group-hover:text-white transition-colors italic">Hub Concierge</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed group-hover:text-slate-500 transition-colors">
                    Direct access to your elite account strategist via Port Support.
                 </p>
              </div>
              <button className="px-10 py-5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-200 group-hover:bg-brand-green group-hover:border-brand-green group-hover:shadow-brand-green/20">
                 Instant Chat
              </button>
           </div>
        </div>

        {/* Live Ledger Activity (Premium Detail) */}
        <div className="space-y-10">
           <div className="flex justify-between items-center px-4">
              <div className="space-y-1">
                 <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                   Recent <span className="text-brand-green underline underline-offset-[8px] decoration-slate-100">Verified</span>
                 </h2>
                 <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em]">Live Hub Activity Stream</p>
              </div>
              <Link href="#" className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors">View Master Ledger</Link>
           </div>
           
           <div className="space-y-4">
              {gym.bookings.filter(b => (b.status as any) === "CHECKED_IN").slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 flex justify-between items-center group hover:border-brand-green hover:shadow-3xl hover:shadow-brand-green/5 transition-all duration-500">
                   <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all shadow-sm">
                         <Zap size={22} className="fill-current" />
                      </div>
                      <div className="space-y-1">
                         <div className="text-xs font-black text-slate-900 uppercase tracking-widest">Client Portal Entry #{booking.id.substring(0, 6)}</div>
                         <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center space-x-3">
                            <span className="text-slate-900">{new Date(booking.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="opacity-30">•</span>
                            <span>Standard Day Pass v2</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right space-y-1">
                      <div className="text-lg font-black text-slate-900 tracking-tighter italic">₹{booking.totalAmount}</div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-green/5 text-brand-green border border-brand-green/10 text-[8px] font-black uppercase tracking-widest">
                         <Check size={10} strokeWidth={4} />
                         <span>Secured</span>
                      </div>
                   </div>
                </div>
              ))}
              
              {gym.bookings.filter(b => b.status === "CHECKED_IN").length === 0 && (
                <div className="p-24 border-2 border-dashed border-slate-50 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-6 group hover:border-slate-100 transition-all">
                   <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                      <AlertCircle size={48} strokeWidth={1} />
                   </div>
                   <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] italic">No active hub activity detected today.</p>
                </div>
              )}
           </div>
        </div>
      </div>
      
      {/* Decorative Brand Footer */}
      <div className="pt-20 pb-10 text-center space-y-4">
         <p className="text-[9px] font-black text-slate-100 uppercase tracking-[0.8em]">PassFit Technologies • Elite Hub Node</p>
      </div>
    </div>
  );
}
