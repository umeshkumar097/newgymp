import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PartnerDashboardPage() {
  // 1. Get user from session cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/gym-login");
  }

  // 2. Verify user exists and is a partner/admin
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || (user.role !== "GYM_OWNER" && user.role !== "ADMIN")) {
    redirect("/gym-login");
  }

  const gyms = await prisma.gym.findMany({
    where: { ownerId: user.id },
    include: {
      bookings: {
        orderBy: { bookingDate: "desc" },
        take: 5,
        include: { plan: true }
      }
    }
  });

  const recentBookings = gyms.flatMap(g => g.bookings);

  const stats = [
    { label: "Today's Check-ins", value: "12", trend: "+2", icon: Users, color: "text-brand-green", bg: "bg-brand-green/10" },
    { label: "Pending OTPs", value: "04", trend: "0", icon: Clock, color: "text-brand-blue", bg: "bg-brand-blue/10" },
    { label: "Monthly Revenue", value: "₹24,500", trend: "+₹2.1k", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg. Rating", value: "4.8", trend: "+0.1", icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="p-6 space-y-10 pb-32">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-outfit text-white">Partner Control</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Real-time gym performance</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400">
          <Filter size={20} />
        </div>
      </div>

      {/* Quick Verification Card */}
      <div className="relative p-8 rounded-[2.5rem] bg-zinc-900 border-2 border-dashed border-zinc-800 space-y-6 overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <QrCode size={120} />
        </div>
        <div className="space-y-2 relative">
          <h2 className="text-xl font-black text-white">Instant Verification</h2>
          <p className="text-zinc-500 text-xs font-medium">Scan QR or enter 4-digit OTP to grant entry.</p>
        </div>
        <OtpVerification gymId={gyms[0]?.id || ""} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center">
               <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                  <stat.icon size={20} />
               </div>
               <span className="text-[10px] font-black text-green-500">{stat.trend}</span>
            </div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</div>
               <div className="text-2xl font-black text-white">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h2 className="text-xl font-black font-outfit text-white">Incoming Users</h2>
           <span className="text-[10px] font-black text-brand-green uppercase tracking-widest underline cursor-pointer">View All</span>
        </div>
        <div className="space-y-4">
          {recentBookings.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-zinc-900 rounded-[2.5rem] text-center space-y-4">
               <div className="w-16 h-16 rounded-full bg-zinc-900 mx-auto flex items-center justify-center text-zinc-700">
                  <Search size={32} />
               </div>
               <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No active bookings found</p>
            </div>
          ) : (
            recentBookings.map((booking: any) => (
              <div key={booking.id} className="p-5 rounded-[2rem] bg-zinc-900 border border-white/5 flex justify-between items-center group active:scale-95 transition-all">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                       <Users size={20} />
                    </div>
                    <div>
                       <div className="text-sm font-bold text-white uppercase tracking-tight">User #{booking.id.substring(0, 6)}</div>
                       <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-0.5">{booking.plan.type} • {new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                 </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-orange-500">OTP: {booking.otp}</div>
                    <div className="text-xs font-black text-white mt-0.5">Collect: ₹{booking.totalAmount}</div>
                    {booking.status === "BOOKED" ? (
                      <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-500 text-[8px] font-black uppercase tracking-widest border border-orange-500/20 mt-1">Collect Payment</div>
                    ) : (
                      <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest border border-green-500/20 mt-1">Paid & Verified</div>
                    )}
                  </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
