"use client";

import { Check, CreditCard, ShieldCheck, Zap, Plus, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Account", icon: Zap },
  { id: 2, title: "Profile", icon: MapPin },
  { id: 3, title: "Media", icon: Plus },
  { id: 4, title: "Pricing", icon: CreditCard },
  { id: 5, title: "KYC & Legal", icon: ShieldCheck },
];

export function OnboardingStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex justify-between items-center w-full max-w-2xl mx-auto px-4 relative">
      {/* Background Line */}
      <div className="absolute top-6 left-10 right-10 h-[1px] bg-zinc-800 -z-10" />
      
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex flex-col items-center space-y-3 relative group">
            <div 
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-2xl",
                isActive ? "bg-brand-green border-brand-green text-zinc-950 scale-110 shadow-brand-green/20" : 
                isCompleted ? "bg-brand-green/10 border-brand-green/30 text-brand-green" : 
                "bg-zinc-900 border-white/5 text-zinc-600 group-hover:border-white/10"
              )}
            >
              {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} strokeWidth={isActive ? 3 : 2} />}
            </div>
            <div className="flex flex-col items-center">
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.2em] transition-colors text-center",
                isActive ? "text-brand-green" : isCompleted ? "text-zinc-400" : "text-zinc-700"
              )}>
                Step {step.id}
              </span>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors mt-0.5 whitespace-nowrap",
                isActive ? "text-white" : "text-zinc-500"
              )}>
                {step.title}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
