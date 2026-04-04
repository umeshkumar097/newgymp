"use client";

import React, { useState, useEffect } from "react";
import { OnboardingStepper } from "@/components/partner/OnboardingStepper";
import { PartnerPhoneAuth } from "@/components/partner/PartnerPhoneAuth";
import { AgreementModal } from "@/components/partner/AgreementModal";
import { MapPin, Clock, Camera, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Upload, Trash2, Zap, Check, Eye, FileText, Ban, Building, AlertCircle, Scan, Cpu, User, Phone, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PartnerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [scanningField, setScanningField] = useState<string | null>(null);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
    gymName: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    openingTime: "06:00 AM",
    closingTime: "10:00 PM",
    weeklyOffDay: "None",
    images: [] as string[],
    amenities: [] as string[],
    dayPassPrice: "0", 
    panNumber: "",
    bankAccount: "",
    ifscCode: "",
    panPhoto: "",
    chequePhoto: "",
    registrationDoc: "",
    agreed: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verifiedFields, setVerifiedFields] = useState<Record<string, boolean>>({});

  const updateForm = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    const field = Object.keys(updates)[0];
    if (field) {
        setErrors(prev => ({ ...prev, [field]: "" }));
        if (verifiedFields[field]) {
            setVerifiedFields(prev => ({ ...prev, [field]: false }));
        }
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name || formData.name.length < 2) newErrors.name = "Enter your full name";
      if (!formData.email || !formData.email.includes("@")) newErrors.email = "Valid email required";
      if (!verifiedFields.email) newErrors.email = "Email verification required";
      if (!formData.password || formData.password.length < 6) newErrors.password = "Password min 6 chars";
      if (formData.phone.length < 10) newErrors.phone = "Valid contact phone required";
    }
    if (step === 2) {
      if (!formData.gymName || formData.gymName.length < 3) newErrors.gymName = "Gym Name must be at least 3 characters";
      if (!formData.location || formData.location.length < 10) newErrors.location = "Full address required (min 10 chars)";
    }
    if (step === 3) {
      if (formData.panNumber.length !== 10) newErrors.panNumber = "Valid 10-digit PAN required";
      if (formData.bankAccount.length < 8) newErrors.bankAccount = "Enter a valid Bank Account number";
      if (formData.ifscCode.length !== 11) newErrors.ifscCode = "Valid 11-digit IFSC required";
      if (!formData.panPhoto) newErrors.panPhoto = "PAN Card photo required";
      if (!formData.chequePhoto) newErrors.chequePhoto = "Bank proof photo required";
      if (!formData.registrationDoc) newErrors.registrationDoc = "Registration Doc required";
      if (!formData.agreed) newErrors.agreed = "Agreement must be accepted";
      if (formData.panPhoto && !verifiedFields.panNumber) newErrors.panNumber = "Please verify PAN data";
      if (formData.chequePhoto && !verifiedFields.bankAccount) newErrors.bankAccount = "Please verify bank data";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const simulateScanning = async (field: string, userValue: string) => {
    setScanningField(field);
    await new Promise(r => setTimeout(r, 2500));
    setScanningField(null);
    if (userValue.length >= 4) {
        setVerifiedFields(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPending(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("type", "kyc");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      updateForm({ [field]: data.url });
      
      if (field === "panPhoto") simulateScanning("panNumber", formData.panNumber);
      if (field === "chequePhoto") simulateScanning("bankAccount", formData.bankAccount);
      if (field === "registrationDoc") simulateScanning("registrationDoc", "verified");
      
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateStep()) return;
    setIsPending(true);
    try {
      const res = await fetch("/api/partner/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStep(5);
        setTimeout(() => router.push("/partner/dashboard"), 4000);
      }
    } catch (err) {
      console.error("Submit failed", err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-32">
      <AgreementModal 
        isOpen={isAgreementOpen} 
        onClose={() => setIsAgreementOpen(false)} 
        data={{
          gymName: formData.gymName,
          address: formData.location,
          date: new Date().toISOString().split('T')[0]
        }}
      />
      
      <header className="py-16 text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 mb-2">
             <Cpu size={12} className="text-brand-green" />
             <span className="text-[10px] font-black text-brand-green uppercase tracking-widest leading-none">Automated Hub Activation</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold font-heading text-slate-900 leading-none tracking-tighter uppercase italic">
          Partner <span className="text-brand-green">Onboarding</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Legal Tie-Up & KYC Registration</p>
      </header>

      <div className="max-w-xl mx-auto mb-20 px-6">
        <div className="flex justify-between relative">
            {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center relative z-10">
                    <div className={cn(
                        "w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black transition-all duration-700",
                        step >= s ? "bg-slate-900 text-white scale-110 shadow-2xl shadow-slate-200" : "bg-white text-slate-300 border border-slate-100"
                    )}>
                        {step > s ? <Check size={20} strokeWidth={4} /> : s}
                    </div>
                </div>
            ))}
            <div className="absolute top-6 left-0 w-full h-[1px] bg-slate-50 -z-0" />
            <div 
                className="absolute top-6 left-0 h-[1px] bg-slate-900 -z-0 transition-all duration-1000" 
                style={{ width: `${((Math.min(step, 4) - 1) / 3) * 100}%` }}
            />
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6">
        <div className="bg-slate-50/50 border border-slate-100 backdrop-blur-3xl rounded-[4rem] p-12 shadow-2xl shadow-slate-200/50 min-h-[600px] flex flex-col justify-between relative overflow-hidden">
          
          {scanningField && (
            <div className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                <div className="relative">
                    <Scan size={100} className="text-brand-green animate-pulse" />
                    <div className="absolute inset-0 border-4 border-brand-green/20 rounded-full animate-ping" />
                </div>
                <div className="text-center space-y-3">
                    <h3 className="text-2xl font-extrabold uppercase italic tracking-tighter text-slate-900">AI Scanning...</h3>
                    <p className="text-[10px] font-black text-brand-green uppercase tracking-widest">Cross-checking document data with input</p>
                </div>
                <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green animate-[scan_2.5s_ease-in-out_infinite]" style={{ width: "30%" }} />
                </div>
            </div>
          )}

          <div className="relative z-10 h-full">
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 py-4">
                <div className="space-y-3">
                  <h2 className="text-4xl font-extrabold uppercase tracking-tight italic flex items-center text-slate-900">
                    <User className="mr-5 text-brand-green" size={32} />
                    Personal Info
                  </h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest pl-13">Create your administrative partner account</p>
                </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Email Address (Business Verified)</label>
                    <div className="flex gap-4">
                       <div className={cn("flex-1 flex items-center space-x-5 bg-white border p-6 rounded-[1.5rem] transition-all shadow-sm", verifiedFields.email ? "border-brand-green/30" : (errors.email ? "border-red-500/50" : "border-slate-100"))}>
                         <User className="text-slate-300" size={18} />
                         <input type="email" value={formData.email} onChange={(e) => updateForm({ email: e.target.value })} placeholder="PARTNER@PASSFIT.IN" className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full" disabled={verifiedFields.email} />
                       </div>
                       {!verifiedFields.email && (
                         <button 
                           onClick={async () => {
                              if (!formData.email.includes("@")) return;
                              setIsPending(true);
                              const res = await fetch("/api/auth/send-otp", {
                                method: "POST",
                                body: JSON.stringify({ email: formData.email, role: "GYM_OWNER" })
                              });
                              if (res.ok) setVerifiedFields(prev => ({ ...prev, emailRequestSent: true }));
                              setIsPending(false);
                           }}
                           className="bg-brand-green text-slate-900 px-8 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-green/10"
                         >
                            {isPending ? <Loader2 className="animate-spin" size={18} /> : "GET OTP"}
                         </button>
                       )}
                    </div>
                  </div>
                  {verifiedFields.emailRequestSent && !verifiedFields.email && (
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-500 bg-brand-green/5 p-8 rounded-[2.5rem] border border-brand-green/10">
                      <div className="flex justify-between items-center px-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-brand-green leading-none">Security Code Sent to Email</label>
                          <Zap size={14} className="text-brand-green animate-pulse" />
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          value={formData.otp} 
                          onChange={(e) => updateForm({ otp: e.target.value })} 
                          placeholder="0000" 
                          maxLength={4} 
                          className="flex-1 bg-white border border-brand-green/30 p-6 rounded-[1.5rem] text-2xl font-extrabold text-brand-green tracking-[0.6em] text-center outline-none shadow-sm" 
                        />
                        <button 
                          disabled={isPending || !formData.email}
                          onClick={async () => {
                             if (formData.otp.length !== 4) return;
                             setIsPending(true);
                             const res = await fetch("/api/auth/verify-otp", {
                               method: "POST",
                               body: JSON.stringify({ 
                                 email: formData.email, 
                                 otp: formData.otp, 
                                 name: formData.name,
                                 role: "GYM_OWNER"
                               })
                             });
                             const data = await res.json();
                             if (data.success) {
                               setVerifiedFields(prev => ({ ...prev, email: true }));
                             } else {
                               setErrors(prev => ({ ...prev, email: data.error || "Invalid OTP" }));
                             }
                             setIsPending(false);
                          }}
                          className="bg-slate-900 text-white px-10 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                           VERIFY
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">WhatsApp Phone Number</label>
                    <div className="flex items-center space-x-5 bg-white border border-slate-100 p-6 rounded-[1.5rem] focus-within:border-brand-green/30 focus-within:shadow-md transition-all shadow-sm group">
                      <Phone size={20} className="text-slate-300 group-focus-within:text-brand-green transition-colors" />
                      <input type="tel" value={formData.phone} onChange={(e) => updateForm({ phone: e.target.value })} placeholder="84494 88090" className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full" maxLength={10} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Security Password</label>
                    <div className="flex items-center space-x-5 bg-white border border-slate-100 p-6 rounded-[1.5rem] focus-within:border-brand-green/30 focus-within:shadow-md transition-all shadow-sm">
                      <Lock size={20} className="text-slate-300" />
                      <input type="password" value={formData.password} onChange={(e) => updateForm({ password: e.target.value })} placeholder="••••••••" className={cn("bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full", errors.password && "text-red-500")} />
                    </div>
                  </div>

                  <div 
                    onClick={() => updateForm({ agreed: !formData.agreed })}
                    className={cn("p-8 rounded-[2.5rem] bg-white border flex items-start space-x-5 cursor-pointer group transition-all shadow-sm", errors.agreed ? "border-red-500/50 bg-red-50/20" : "border-slate-100 hover:bg-slate-50")}
                  >
                    <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center transition-all mt-0.5 shrink-0",
                    formData.agreed ? "bg-brand-green" : (errors.agreed ? "bg-red-500/10 border border-red-200" : "bg-slate-100 border border-slate-200")
                    )}>
                    {formData.agreed && <Check size={16} className="text-slate-900 font-black" />}
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                        I acknowledge that I am a legal representative of this gym and agree to PassFit's <span className="text-brand-green underline uppercase tracking-widest font-black">Partner Terms of Service</span>.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Hub Administrator Name</label>
                    <div className="flex items-center space-x-5 bg-white border border-slate-100 p-6 rounded-[1.5rem] focus-within:border-brand-green/30 focus-within:shadow-md transition-all shadow-sm group">
                      <User size={20} className="text-slate-300 group-focus-within:text-brand-green transition-colors" />
                      <input type="text" value={formData.name} onChange={(e) => updateForm({ name: e.target.value })} placeholder="JONATHAN DOE" className={cn("bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full", errors.name && "text-red-500")} />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button onClick={handleNext} disabled={!verifiedFields.email || !formData.agreed} className={cn("w-full py-8 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all shadow-2xl flex items-center justify-center space-x-3 active:scale-95", (verifiedFields.email && formData.agreed) ? "bg-slate-900 text-white shadow-slate-200/50" : "bg-slate-100 text-slate-400 pointer-events-none")}>
                      <span>CREATE HUB & CONTINUE</span>
                      <ArrowRight size={20} />
                    </button>
                    {errors.email && <p className="text-center text-red-500 text-[10px] font-black uppercase mt-6 tracking-widest">{errors.email}</p>}
                  </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                 <div className="space-y-3">
                    <h2 className="text-4xl font-extrabold uppercase flex items-center tracking-tight italic text-slate-900">
                      <Building className="mr-6 text-brand-blue" size={36} />
                      Business Info
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] px-15">Basic gym name and location details</p>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Official Gym Name *</label>
                      <input type="text" value={formData.gymName} onChange={(e) => updateForm({ gymName: e.target.value })} placeholder="e.g. Iron Paradise Fitness" className={cn("w-full bg-white border p-7 rounded-[1.5rem] text-sm font-extrabold outline-none transition-all placeholder:text-slate-200 shadow-sm focus:shadow-md", errors.gymName ? "border-red-500/50 bg-red-50/10" : "border-slate-100 focus:border-brand-green/30")} />
                      {errors.gymName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-2 flex items-center"><AlertCircle size={12} className="mr-2" /> {errors.gymName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Opening Time</label>
                          <div className="relative">
                             <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                             <input type="text" value={formData.openingTime} onChange={(e) => updateForm({ openingTime: e.target.value })} placeholder="06:00 AM" className="w-full bg-white border border-slate-100 p-6 pl-16 rounded-[1.5rem] text-xs font-black outline-none focus:border-brand-green/30 shadow-sm" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Closing Time</label>
                          <div className="relative">
                             <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                             <input type="text" value={formData.closingTime} onChange={(e) => updateForm({ closingTime: e.target.value })} placeholder="10:00 PM" className="w-full bg-white border border-slate-100 p-6 pl-16 rounded-[1.5rem] text-xs font-black outline-none focus:border-brand-green/30 shadow-sm" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Weekly Off Day</label>
                       <div className="relative">
                       <select 
                          value={formData.weeklyOffDay} 
                          onChange={(e) => updateForm({ weeklyOffDay: e.target.value })}
                          className="w-full bg-white border border-slate-100 p-7 rounded-[1.5rem] text-xs font-black uppercase tracking-widest outline-none focus:border-brand-green/30 appearance-none cursor-pointer shadow-sm"
                       >
                          <option value="None">Open All Week (No Off)</option>
                          <option value="Sunday">Sunday</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                       </select>
                       <ChevronRight className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={20} />
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 mt-4 flex items-center leading-none">
                          <AlertCircle size={14} className="mr-2 text-brand-blue" />
                          OWNER CAN MANUALLY PAUSE GYM FROM DASHBOARD
                       </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Full Operational Address *</label>
                      <textarea value={formData.location} onChange={(e) => updateForm({ location: e.target.value })} placeholder="Street, Area, City, Pincode" className={cn("w-full bg-white border p-7 rounded-[2rem] text-sm font-extrabold outline-none transition-all h-36 resize-none placeholder:text-slate-200 shadow-sm focus:shadow-md", errors.location ? "border-red-500/50 bg-red-50/10" : "border-slate-100 focus:border-brand-green/30")} />
                      {errors.location && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-2 flex items-center"><AlertCircle size={12} className="mr-2" /> {errors.location}</p>}
                    </div>
                 </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                 <div className="space-y-3">
                    <h2 className="text-4xl font-extrabold uppercase flex items-center tracking-tight italic text-slate-900">
                      <ShieldCheck className="mr-6 text-brand-green" size={36} />
                      Legal Tie-Up
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] px-15">Submit documents for official verification</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 flex justify-between leading-none">
                            PAN Number *
                            {verifiedFields.panNumber && <span className="text-brand-green flex items-center italic text-[10px] font-black tracking-tighter">MATCHED <Check size={12} className="ml-1" /></span>}
                        </label>
                        <input type="text" value={formData.panNumber} onChange={(e) => updateForm({ panNumber: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" className={cn("w-full bg-white border p-6 rounded-[1.5rem] text-xs font-black outline-none transition-all shadow-sm", errors.panNumber ? "border-red-500/50 bg-red-50/10" : (verifiedFields.panNumber ? "border-brand-green/30 text-brand-green" : "border-slate-100 focus:border-brand-green/20"))} maxLength={10} />
                        {errors.panNumber && <p className="text-[10px] text-red-500 font-bold uppercase pl-2">{errors.panNumber}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">PAN Card Photo *</label>
                        <label className={cn("w-full bg-white border p-6 rounded-[1.5rem] flex items-center justify-between cursor-pointer hover:border-brand-green/30 transition-all overflow-hidden shadow-sm", errors.panPhoto ? "border-red-500/50 bg-red-50/10" : (verifiedFields.panNumber ? "border-brand-green/20" : "border-slate-100"))}>
                            <span className={cn("text-[10px] font-black truncate pr-4", formData.panPhoto ? "text-brand-green" : (errors.panPhoto ? "text-red-500" : "text-slate-300 uppercase italic"))}>
                                {formData.panPhoto ? "UPLOADED ✅" : (errors.panPhoto || "SELECT IMAGE")}
                            </span>
                            <Upload size={18} className={formData.panPhoto ? "text-brand-green" : "text-slate-300"} />
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "panPhoto")} className="hidden" />
                        </label>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 flex justify-between leading-none">
                            Registration Doc (GST/Udyam) *
                            {verifiedFields.registrationDoc && <span className="text-brand-blue flex items-center italic text-[10px] font-black tracking-tighter">DOC VERIFIED <Check size={12} className="ml-1" /></span>}
                        </label>
                        <label className={cn("w-full bg-white border p-7 rounded-[1.5rem] flex items-center justify-between cursor-pointer transition-all overflow-hidden group shadow-sm", errors.registrationDoc ? "border-red-500/50 bg-red-50/10" : (verifiedFields.registrationDoc ? "border-brand-blue/30 shadow-md" : "border-slate-100 hover:border-brand-blue/30"))}>
                            <div className="flex items-center">
                                <FileText className={cn("mr-5", formData.registrationDoc ? "text-brand-blue" : (errors.registrationDoc ? "text-red-500" : "text-slate-300"))} size={24} />
                                <span className={cn("text-xs font-black uppercase", formData.registrationDoc ? "text-slate-900" : (errors.registrationDoc ? "text-red-500" : "text-slate-300 italic"))}>
                                    {formData.registrationDoc ? "DOC ATTACHED ✅" : (errors.registrationDoc || "UPLOAD BUSINESS CERTIFICATE")}
                                </span>
                            </div>
                            <Upload size={20} className="text-slate-300 group-hover:text-brand-blue" />
                            <input type="file" accept="image/*,pdf" onChange={(e) => handleFileUpload(e, "registrationDoc")} className="hidden" />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Bank Account *</label>
                            <input type="text" value={formData.bankAccount} onChange={(e) => updateForm({ bankAccount: e.target.value })} placeholder="Account Num" className={cn("w-full bg-white border p-6 rounded-[1.5rem] text-xs font-black outline-none shadow-sm", errors.bankAccount ? "border-red-500/50" : (verifiedFields.bankAccount ? "border-brand-green/30 text-brand-green shadow-md" : "border-slate-100"))} />
                            {errors.bankAccount && <p className="text-[10px] text-red-500 font-bold uppercase pl-2">{errors.bankAccount}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">IFS Code *</label>
                            <input type="text" value={formData.ifscCode} onChange={(e) => updateForm({ ifscCode: e.target.value.toUpperCase() })} placeholder="HDFC000..." className={cn("w-full bg-white border p-6 rounded-[1.5rem] text-xs font-black outline-none shadow-sm", errors.ifscCode ? "border-red-500/50" : "border-slate-100")} maxLength={11} />
                            {errors.ifscCode && <p className="text-[10px] text-red-500 font-bold uppercase pl-2">{errors.ifscCode}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 leading-none">Cancelled Cheque Photo *</label>
                        <label className={cn("w-full bg-white border p-6 rounded-[1.5rem] flex items-center justify-between cursor-pointer transition-all overflow-hidden shadow-sm", errors.chequePhoto ? "border-red-500/50 bg-red-50/10" : (verifiedFields.bankAccount ? "border-brand-green/20 shadow-md" : "border-slate-100"))}>
                            <span className={cn("text-[10px] font-black truncate pr-4", formData.chequePhoto ? "text-brand-green" : (errors.chequePhoto ? "text-red-500" : "text-slate-300 uppercase italic"))}>
                                {formData.chequePhoto ? "UPLOADED ✅" : (errors.chequePhoto || "SELECT IMAGE")}
                            </span>
                            <Upload size={18} className={formData.chequePhoto ? "text-brand-green" : "text-slate-300"} />
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "chequePhoto")} className="hidden" />
                        </label>
                    </div>

                    <div 
                        onClick={() => updateForm({ agreed: !formData.agreed })}
                        className={cn("p-8 rounded-[2.5rem] bg-white border flex items-start space-x-5 cursor-pointer group transition-all shadow-sm", errors.agreed ? "border-red-500/50 bg-red-50/10" : "border-slate-100 hover:bg-slate-50")}
                    >
                        <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center transition-all mt-0.5 shrink-0",
                        formData.agreed ? "bg-brand-green" : (errors.agreed ? "bg-red-500/10 border border-red-200" : "bg-slate-100 border border-slate-200")
                        )}>
                        {formData.agreed && <Check size={16} className="text-slate-900 font-black" />}
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                            I agree to the <span onClick={(e) => { e.stopPropagation(); setIsAgreementOpen(true); }} className="text-brand-green underline uppercase tracking-widest font-black cursor-pointer hover:text-slate-900 transition-colors">Partner Tie-up Agreement</span>
                        </p>
                    </div>
                 </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 text-center">
                    <h2 className="text-4xl font-extrabold uppercase tracking-tight italic text-slate-900">Final Review</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Ready for PassFit submission</p>
                    <div className="p-12 rounded-[4rem] bg-white border border-slate-100 space-y-6 text-left shadow-2xl shadow-slate-200/50 outline outline-4 outline-slate-50">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest px-6 py-3 border-b border-slate-50">
                            <span className="text-slate-400">Business</span>
                            <span className="text-slate-900">{formData.gymName}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest px-6 py-3 border-b border-slate-50">
                            <span className="text-slate-400">Matching Status</span>
                            <span className="text-brand-green italic flex items-center font-black">
                                100% MATCH <Check size={14} className="ml-2" />
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest px-6 py-3">
                            <span className="text-slate-400">KYC Status</span>
                            <span className="text-brand-green italic flex items-center font-black animate-pulse">
                                INTEGRITY VERIFIED <ShieldCheck size={14} className="ml-2" />
                            </span>
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase italic tracking-tight px-10 leading-relaxed">Notifications will be sent via WhatsApp and Email upon approval.</p>
              </div>
            )}

            {step > 1 && step < 5 && (
              <div className="flex gap-6 pt-12">
                <button onClick={() => setStep(prev => prev - 1)} className="flex-1 bg-white border border-slate-100 text-slate-400 font-extrabold py-8 rounded-[3rem] text-[12px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-sm hover:text-slate-900">BACK</button>
                <button onClick={() => { if (step === 4) handleFinalSubmit(); else handleNext(); }} disabled={isPending || !!scanningField} className={cn("flex-[2.5] text-white font-black py-8 rounded-[3rem] text-[12px] uppercase tracking-[0.4em] active:scale-95 transition-all shadow-2xl", step === 4 ? "bg-slate-900 shadow-slate-200" : "bg-brand-green !text-slate-900 shadow-brand-green/20")}>
                  {isPending ? <Loader2 className="animate-spin mx-auto" size={24} /> : (step === 4 ? "SUBMIT NOW" : "CONTINUE")}
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col items-center justify-center text-center space-y-10 pt-20 animate-in zoom-in duration-1000">
                 <div className="w-28 h-28 rounded-[3.5rem] bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shadow-3xl shadow-brand-green/5 outline outline-8 outline-brand-green/5">
                    <CheckCircle2 size={56} className="animate-in zoom-in spin-in-90 duration-1000" />
                 </div>
                 <div className="space-y-6">
                    <h2 className="text-5xl font-extrabold uppercase tracking-tighter italic text-slate-900">Application Sent</h2>
                    <p className="max-w-xs mx-auto text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed">Our legal team is reviewing your documents. You will receive a notification within 24 hours.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes scan {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
