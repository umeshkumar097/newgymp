import React from "react";
import { Bell, ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Booking Confirmed",
      message: "Your pass for Gold's Gym has been confirmed. See you soon!",
      time: "2 hours ago",
      type: "SUCCESS"
    },
    {
      id: 2,
      title: "Welcome to PassFit!",
      message: "Get ready for a premium fitness experience.",
      time: "1 day ago",
      type: "INFO"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 p-6 space-y-8 pb-32">
      <div className="flex items-center space-x-4 mt-8">
        <Link href="/profile" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 border border-white/5 active:scale-90 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black font-outfit text-white">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 space-y-3 relative overflow-hidden group">
            <div className="flex justify-between items-start">
               <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${notif.type === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                     {notif.type === 'SUCCESS' ? <CheckCircle2 size={16} /> : <Bell size={16} />}
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">{notif.title}</h3>
               </div>
               <div className="flex items-center text-[10px] font-bold text-zinc-600 uppercase">
                  <Clock size={10} className="mr-1" />
                  {notif.time}
               </div>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
