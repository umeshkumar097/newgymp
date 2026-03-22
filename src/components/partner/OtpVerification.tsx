"use client";

import React, { useState, useTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { verifyBooking } from "@/app/actions/partner";

export function OtpVerification({ gymId }: { gymId: string }) {
  const [otp, setOtp] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    if (otp.length !== 4) return;
    
    startTransition(async () => {
      const res = await verifyBooking(otp, gymId);
      if (res.success) {
        alert("Booking verified & Payment confirmed! Welcome user.");
        setOtp("");
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="flex space-x-3 relative">
      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 focus-within:border-orange-500 transition-all flex items-center">
        <input 
          type="text" 
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 4-digit OTP" 
          className="bg-transparent border-none outline-none text-white font-black text-lg w-full placeholder:text-zinc-700 placeholder:font-bold"
          maxLength={4}
        />
      </div>
      <button 
        disabled={isPending || otp.length !== 4}
        onClick={handleVerify}
        className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
      >
        <ArrowUpRight size={24} strokeWidth={3} />
      </button>
    </div>
  );
}
