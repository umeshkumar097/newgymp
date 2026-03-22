"use client";

import React, { useState } from "react";
import { Check, CreditCard, FileText, ClipboardList, Rocket, ChevronRight, ShieldCheck, Zap, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Subscription", icon: CreditCard },
  { id: 2, title: "KYC Details", icon: ShieldCheck },
  { id: 3, title: "Agreement", icon: FileText },
  { id: 4, title: "Gym Listing", icon: ClipboardList },
];

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function PartnerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));

  const loadCashfree = () => {
    return new Promise((resolve) => {
      if (window.Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadCashfree();

    if (!res) {
      alert("Cashfree SDK failed to load.");
      setLoading(false);
      return;
    }

    try {
      const orderId = `sub_${Date.now()}`;
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: 299, 
          orderId,
          customerId: "new_partner",
          customerPhone: "9999999999" 
        }),
      });

      const orderData = await orderRes.json();
      
      if (!orderData.payment_session_id) {
        throw new Error("Failed to create payment session");
      }

      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "PRODUCTION" ? "production" : "sandbox",
      });

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal",
      }).then((result: any) => {
        if (result.error) {
          alert(result.error.message);
        } else {
          nextStep();
        }
      });

    } catch (error) {
      console.error("Subscription Error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-10 pb-32">
      {/* Progress Stepper */}
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

      {/* Content Area */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-outfit text-white">Choose Your Plan</h2>
              <p className="text-zinc-400 text-sm font-medium">Activate your partner status to start listing your gym.</p>
            </div>

            <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-orange-600 border border-white/20 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">Launch Offer</div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Partner Subscription</h3>
                  <p className="text-white/70 text-xs font-medium mt-1">Full access for 3 months</p>
                </div>
                
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black text-white">₹299</span>
                  <span className="text-white/60 text-sm font-bold">/ 3 months</span>
                </div>

                <ul className="space-y-3">
                  {[
                    "Zero Commission (First 3 Months)",
                    "Priority Gym Listing",
                    "Advanced Booking Dashboard",
                    "Dedicated Partner Support",
                    "Multi-member Booking Support"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center text-xs font-bold text-white/90">
                      <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center mr-3">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-white text-zinc-950 font-black py-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest hover:bg-zinc-100 disabled:opacity-50"
            >
              <span>{loading ? "Processing..." : "Subscribe Now"}</span>
              {!loading && <ChevronRight size={18} />}
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-outfit text-white">KYC Verification</h2>
              <p className="text-zinc-400 text-sm font-medium">We need some documents to verify your business.</p>
            </div>

            <div className="space-y-4">
              {["Owner Aadhaar / PAN", "Gym Address Proof", "Business GST (Optional)"].map((doc) => (
                <div key={doc} className="p-6 rounded-3xl bg-zinc-800/30 border border-zinc-700/30 flex justify-between items-center group cursor-pointer hover:border-orange-500/50 transition-all border-dashed">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                      <FileText size={20} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{doc}</div>
                      <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Click to upload PDF/JPG</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <Plus size={16} className="text-zinc-500" />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={nextStep}
              className="w-full bg-orange-500 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-orange-500/20 flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest hover:bg-orange-600"
            >
              <span>Continue</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-outfit text-white">Partner Agreement</h2>
              <p className="text-zinc-400 text-sm font-medium">Please review and sign the digital partnership agreement.</p>
            </div>

            <div className="h-64 overflow-y-auto p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-[10px] font-medium text-zinc-500 leading-relaxed scrollbar-hide">
              <p className="font-bold text-zinc-300 mb-2 uppercase tracking-widest">Terms of Service</p>
              1. This agreement is between PassFit (Company) and the Gym Owner (Partner).<br /><br />
              2. The Partner agrees to accept bookings from PassFit users and verify them via QR code and OTP.<br /><br />
              3. Payment for bookings will be processed by PassFit and transferred to the Partner after deducting commission (if applicable).<br /><br />
              4. For the first 3 months, zero commission will be charged as per the launch offer.<br /><br />
              5. The Partner must maintain gym facilities in good condition and ensure user safety.
              <br /><br />
              [More terms...]
            </div>

            <div className="flex items-start space-x-4 p-2">
              <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center mt-0.5 shadow-lg shadow-orange-500/20">
                <Check size={14} className="text-white" strokeWidth={3} />
              </div>
              <p className="text-[11px] text-zinc-400 font-bold leading-tight uppercase tracking-wide">
                I agree to the terms and conditions and I am authorized to sign this agreement.
              </p>
            </div>

            <button 
              onClick={nextStep}
              className="w-full bg-orange-500 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-orange-500/20 flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest hover:bg-orange-600"
            >
              <span>Digitally Sign & Finish</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8 flex flex-col items-center text-center pt-8">
            <div className="w-24 h-24 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-2xl shadow-orange-500/10">
              <Rocket size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-outfit text-white">You're All Set!</h2>
              <p className="text-zinc-400 text-sm font-medium px-4">Your application has been submitted for review. Our team will verify your KYC and activate your gym within 24 hours.</p>
            </div>

            <div className="w-full p-6 rounded-3xl bg-zinc-800/30 border border-zinc-700/30 space-y-4">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black">1</div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-widest">Application Under Review</div>
                  <div className="text-[10px] text-zinc-500">Currently being verified by admin</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentStep(1)}
              className="w-full bg-zinc-800 text-white font-black py-5 rounded-[2.5rem] shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              <span>Go to Dashboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
