"use client";

import { Check, CreditCard, FileText, ClipboardList, Rocket, ChevronRight, ShieldCheck, Zap, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Subscription", icon: CreditCard },
  { id: 2, title: "KYC Details", icon: ShieldCheck },
  { id: 3, title: "Agreement", icon: FileText },
  { id: 4, title: "Gym Listing", icon: ClipboardList },
];

export function OnboardingStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex justify-between items-center px-2">
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex flex-col items-center space-y-2 relative">
            <div 
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300",
                isActive ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-110" : 
                isCompleted ? "bg-green-500/20 border-green-500/50 text-green-500" : 
                "bg-zinc-800/50 border-zinc-800 text-zinc-500"
              )}
            >
              {isCompleted ? <Check size={20} /> : <Icon size={20} />}
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest transition-colors",
              isActive ? "text-white" : "text-zinc-500"
            )}>
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
