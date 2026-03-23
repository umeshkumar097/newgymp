"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Minus, Check, ChevronRight, ShoppingBag, ShieldCheck, Loader2, LogIn } from "lucide-react";
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

  // Check auth status on mount
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
    const planPrice = selectedPlan.price * memberCount;
    const addonPrice = selectedAddons.length * 99;
    return planPrice + addonPrice;
  }, [selectedPlan, memberCount, selectedAddons]);

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
          <h2 className="text-2xl font-black font-outfit text-white">Customize Booking</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Member Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Number of Members</h3>
            <div className="flex items-center space-x-4 bg-zinc-800/50 p-2 rounded-2xl border border-zinc-800">
              <button 
                onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                className="w-8 h-8 rounded-xl bg-zinc-700 flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-black text-white w-4 text-center">{memberCount}</span>
              <button 
                onClick={() => setMemberCount(memberCount + 1)}
                className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Upsell / Addons */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Boost Your Session</h3>
          <div className="grid grid-cols-2 gap-3">
            {["Premium Locker", "Steam & Sauna", "Personal Trainer", "Pre-workout"].map((addon) => (
              <div 
                key={addon}
                onClick={() => toggleAddon(addon)}
                className={cn(
                  "p-4 rounded-3xl border transition-all cursor-pointer flex flex-col items-center space-y-2 text-center",
                  selectedAddons.includes(addon) 
                    ? "bg-orange-500/10 border-orange-500 text-white" 
                    : "bg-zinc-800/30 border-zinc-800 text-zinc-500"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  selectedAddons.includes(addon) ? "bg-orange-500 text-white" : "bg-zinc-700"
                )}>
                  {selectedAddons.includes(addon) ? <Check size={16} /> : <Plus size={16} />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{addon}</span>
                <span className="text-xs font-black">+₹99</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total & Checkout */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Final Amount</span>
              <span className="text-3xl font-black text-white tracking-tight">₹{totalAmount}</span>
            </div>
            {!isAuthenticated && isAuthenticated !== null && (
              <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full flex items-center text-[10px] font-bold text-red-500 uppercase tracking-widest">
                Login Required
              </div>
            )}
          </div>
          
          {isAuthenticated === false ? (
            <button 
              onClick={() => router.push("/auth")}
              className="w-full bg-white text-zinc-950 font-black py-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all uppercase tracking-widest text-sm"
            >
              <LogIn size={18} />
              <span>Login to Confirm Booking</span>
            </button>
          ) : (
            <button 
              disabled={loading || isAuthenticated === null}
              onClick={handleBooking}
              className={cn(
                "w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-orange-500/30 flex items-center justify-center space-x-3 active:scale-95 transition-all uppercase tracking-widest text-sm",
                (loading || isAuthenticated === null) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>CONFIRMING...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM BOOKING</span>
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
