"use client";

import React, { useTransition } from "react";
import { Check, X, Eye } from "lucide-react";
import { approveGym, rejectGym } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

export function ModerationButtons({ gymId }: { gymId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveGym(gymId);
      if (!res.success) alert(res.error);
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const res = await rejectGym(gymId);
      if (!res.success) alert(res.error);
    });
  };

  return (
    <div className="flex justify-end space-x-2">
      <button className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all border border-zinc-700/50 active:scale-95">
        <Eye size={18} />
      </button>
      <button 
        disabled={isPending}
        onClick={handleApprove}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-green-500/20 active:scale-95",
          isPending ? "bg-zinc-800 text-zinc-500" : "bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white"
        )}
      >
        <Check size={18} />
      </button>
      <button 
        disabled={isPending}
        onClick={handleReject}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-red-500/20 active:scale-95",
          isPending ? "bg-zinc-800 text-zinc-500" : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
        )}
      >
        <X size={18} />
      </button>
    </div>
  );
}
