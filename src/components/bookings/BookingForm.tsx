"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Minus, Check, ChevronRight, ShoppingBag, ShieldCheck, Loader2, LogIn, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  gym: any;
  onClose: () => void;
}

export function BookingForm({ gym, onClose }: BookingFormProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(gym.plans[0]);
  const [memberCount, setMemberCount] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check auth status on mount (Supports Hybrid Auth)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        setIsAuthenticated(data.loggedIn);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const totalAmount = useMemo(() => {
    const planPrice = (selectedPlan?.price || 0) * memberCount;
    const addonPrice = selectedAddons.length * 99;
    return planPrice + addonPrice;
  }, [selectedPlan, memberCount, selectedAddons]);

  // Sync Intent with Server - ONLY if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncIntent = async () => {
      try {
        await fetch("/api/bookings/intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gymId: gym.id,
            planId: selectedPlan.id,
            amount: totalAmount,
            members: memberCount,
            addons: selectedAddons,
          }),
        });
      } catch (err) {
        console.error("Failed to sync intent:", err);
      }
    };

    const timeout = setTimeout(syncIntent, 1000);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, gym.id, selectedPlan.id, totalAmount, memberCount, selectedAddons]);

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        gymId: gym.id,
        gymName: gym.name,
        planId: selectedPlan.id,
        amount: totalAmount,
        members: memberCount,
        addons: selectedAddons,
      };

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth");
          return;
        }
        throw new Error(result.error || "Failed to confirm booking");
      }

      router.push(`/bookings/${result.bookingId}/success`);

    } catch (error: any) {
      console.error("Booking Error:", error);
      alert(`Booking Error: ${error.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end justify-center">
      <div className="w-full max-w-md bg-zinc-900 rounded-t-[3rem] p-8 space-y-8 animate-in slide-in-from-bottom duration-500 shadow-2xl border-t border-white/10 overflow-y-auto max-h-[90vh] scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter">Customize Booking</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Member Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Number of Members</h3>
            <div className="flex items-center space-x-4 bg-zinc-800/50 p-2 rounded-2xl border border-zinc-800">
              <button 
                onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                className="w-10 h-10 rounded-xl bg-zinc-700 flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-black text-white w-6 text-center tabular-nums">{memberCount}</span>
              <button 
                onClick={() => setMemberCount(memberCount + 1)}
                className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-zinc-950 active:scale-90 transition-transform"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Upsell / Addons */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Boost Your Session</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
                { name: "Premium Locker", price: "+₹99" },
                { name: "Steam & Sauna", price: "+₹99" },
                { name: "Personal Trainer", price: "+₹99" },
                { name: "Pre-workout", price: "+₹99" }
            ].map((addon) => (
              <div 
                key={addon.name}
                onClick={() => toggleAddon(addon.name)}
                className={cn(
                  "p-4 rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center space-y-2 text-center relative overflow-hidden",
                  selectedAddons.includes(addon.name) 
                    ? "bg-brand-green/10 border-brand-green/40 text-brand-green" 
                    : "bg-zinc-800/30 border-zinc-800 text-zinc-500 hover:border-zinc-700 font-bold"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  selectedAddons.includes(addon.name) ? "bg-brand-green text-zinc-950" : "bg-zinc-700"
                )}>
                  {selectedAddons.includes(addon.name) ? <Check size={16} /> : <Plus size={16} />}
                </div>
                <span className="text-[9px] font-black uppercase tracking-tight">{addon.name}</span>
                <span className="text-xs font-black">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total & Checkout */}
        <div className="pt-6 border-t border-zinc-800/50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase block tracking-widest">Final Amount</span>
              <span className="text-4xl font-black text-white tracking-tighter tabular-nums">₹{totalAmount}</span>
            </div>
            {isAuthenticated === false && (
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full flex items-center text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">
                <Lock size={12} className="mr-2" />
                Login Required
              </div>
            )}
            {isAuthenticated === true && (
               <div className="bg-brand-green/10 border border-brand-green/20 px-4 py-1.5 rounded-full flex items-center text-[9px] font-black text-brand-green uppercase tracking-[0.2em]">
                <ShieldCheck size={12} className="mr-2" />
                Authorized
              </div>
            )}
          </div>
          
          {isAuthenticated === false ? (
            <div className="space-y-4">
               <div className="p-4 bg-zinc-950/50 rounded-2xl border border-white/5 flex items-start space-x-3">
                  <Lock size={16} className="text-zinc-600 mt-0.5" />
                  <p className="text-[10px] font-medium text-zinc-500 leading-normal">Your account is required to generate a tracking ID and secure your member pass. Please log in to proceed with confirmation.</p>
               </div>
               <button 
                 onClick={() => router.push("/auth")}
                 className="w-full bg-white text-zinc-950 font-black py-6 rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all uppercase tracking-widest text-xs"
               >
                 <LogIn size={18} />
                 <span>Login to Confirm Booking</span>
               </button>
            </div>
          ) : (
            <button 
              disabled={loading || isAuthenticated === null}
              onClick={handleBooking}
              className={cn(
                "w-full bg-brand-green text-zinc-950 font-black py-6 rounded-[2rem] shadow-2xl shadow-brand-green/10 flex items-center justify-center space-x-3 active:scale-95 transition-all uppercase tracking-[0.2em] text-xs",
                (loading || isAuthenticated === null) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>SECURING ACCESS...</span>
                </>
              ) : (
                <>
                  <span>Confirm HUB Booking</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
