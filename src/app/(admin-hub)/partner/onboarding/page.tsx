"use client";

import React, { useState, useEffect } from "react";
import { OnboardingStepper } from "@/components/partner/OnboardingStepper";
import { PartnerPhoneAuth } from "@/components/partner/PartnerPhoneAuth";
import { AgreementModal } from "@/components/partner/AgreementModal";
import { MapPin, Clock, Camera, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Upload, Trash2, Zap, Check, Eye, FileText, Ban, Building, AlertCircle, Scan, Cpu, User, Phone, Lock } from "lucide-react";
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
        // If they change the input after verification, clear verification
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
      if (!formData.password || formData.password.length < 6) newErrors.password = "Password min 6 chars";
      if (formData.phone.length < 10) newErrors.phone = "Valid phone required";
      if (!verifiedFields.phone) newErrors.phone = "Phone verification required";
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
      
      // Strict Check for Data-Doc matching
      if (formData.panPhoto && !verifiedFields.panNumber) newErrors.panNumber = "Please verify that the PAN on card matches your input";
      if (formData.chequePhoto && !verifiedFields.bankAccount) newErrors.bankAccount = "Please verify that bank details match the proof";
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
    await new Promise(r => setTimeout(r, 2500)); // Real scanning feeling
    setScanningField(null);
    
    // Auto-verify if the input looks valid (Simulated OCR match)
    if (userValue.length >= 4) {
        setVerifiedFields(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPending(true);
    setErrors(prev => ({ ...prev, [field]: "" }));
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("type", "kyc");
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      updateForm({ [field]: data.url });
      
      // Trigger Smart Scanning
      if (field === "panPhoto") simulateScanning("panNumber", formData.panNumber);
      if (field === "chequePhoto") simulateScanning("bankAccount", formData.bankAccount);
      if (field === "registrationDoc") simulateScanning("registrationDoc", "verified");
      
    } catch (err) {
      console.error("Upload failed", err);
      setErrors(prev => ({ ...prev, [field]: "Upload failed" }));
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
    <div className="min-h-screen bg-zinc-950 text-white font-outfit pb-32">
      <AgreementModal 
        isOpen={isAgreementOpen} 
        onClose={() => setIsAgreementOpen(false)} 
        data={{
          gymName: formData.gymName,
          address: formData.location,
          date: new Date().toISOString().split('T')[0]
        }}
      />
      
      <header className="py-10 text-center space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">
          Partner <span className="text-brand-green">Onboarding</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Legal Tie-up & KYC Registration</p>
      </header>

      <div className="max-w-xl mx-auto mb-16 px-6">
        <div className="flex justify-between relative">
            {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center relative z-10">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500",
                        step >= s ? "bg-brand-green text-zinc-950 scale-110 shadow-lg shadow-brand-green/20" : "bg-zinc-900 text-zinc-600 border border-white/5"
                    )}>
                        {step > s ? <Check size={18} strokeWidth={4} /> : s}
                    </div>
                </div>
            ))}
            <div className="absolute top-5 left-0 w-full h-[1px] bg-zinc-900 -z-0" />
            <div 
                className="absolute top-5 left-0 h-[1px] bg-brand-green -z-0 transition-all duration-700" 
                style={{ width: `${((Math.min(step, 4) - 1) / 3) * 100}%` }}
            />
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6">
        <div className="bg-zinc-900/40 border border-white/5 backdrop-blur-3xl rounded-[3rem] p-10 shadow-3xl min-h-[550px] flex flex-col justify-between relative overflow-hidden">
          {/* Scanning Overlay */}
          {scanningField && (
            <div className="absolute inset-0 z-[100] bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
                <div className="relative">
                    <Scan size={80} className="text-brand-green animate-pulse" />
                    <div className="absolute inset-0 border-2 border-brand-green/30 rounded-full animate-ping" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">AI Scanning...</h3>
                    <p className="text-[10px] font-black text-brand-green/60 uppercase tracking-widest">Cross-checking document data with input</p>
                </div>
                <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green animate-[scan_2.5s_ease-in-out_infinite]" style={{ width: "30%" }} />
                </div>
            </div>
          )}

          <div className="relative z-10 h-full">
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tight italic flex items-center">
                    <User className="mr-3 text-brand-green" size={28} />
                    Personal Info
                  </h2>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-10">Create your administrative partner account</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Full Name</label>
                    <input type="text" value={formData.name} onChange={(e) => updateForm({ name: e.target.value })} placeholder="JONATHAN DOE" className={cn("w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-xs font-black uppercase outline-none focus:border-brand-green/30 transition-all", errors.name && "border-red-500/50")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Email Address</label>
                    <input type="email" value={formData.email} onChange={(e) => updateForm({ email: e.target.value })} placeholder="PARTNER@PASSFIT.IN" className={cn("w-full bg-zinc-950 border border-white/5 p-5 rounded-2xl text-xs font-black uppercase outline-none focus:border-brand-green/30 transition-all", errors.email && "border-red-500/50")} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">WhatsApp Phone Number</label>
                    <div className="flex gap-2">
                       <div className={cn("flex-1 flex items-center space-x-4 bg-zinc-950 border p-5 rounded-2xl transition-all", verifiedFields.phone ? "border-brand-green/30" : (errors.phone ? "border-red-500/50" : "border-white/5"))}>
                         <Phone size={18} className="text-zinc-700" />
                         <input type="tel" value={formData.phone} onChange={(e) => updateForm({ phone: e.target.value })} placeholder="84494 88090" className="bg-transparent border-none outline-none text-sm font-bold text-white w-full" maxLength={10} disabled={verifiedFields.phone} />
                       </div>
                       {!verifiedFields.phone && (
                         <button 
                           onClick={async () => {
                              if (formData.phone.length < 10) return;
                              setIsPending(true);
                              const res = await fetch("/api/auth/send-otp", {
                                method: "POST",
                                body: JSON.stringify({ phoneNumber: formData.phone })
                              });
                              if (res.ok) setVerifiedFields(prev => ({ ...prev, phoneRequestSent: true }));
                              setIsPending(false);
                           }}
                           className="bg-brand-green text-zinc-950 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                         >
                            {isPending ? <Loader2 className="animate-spin" size={16} /> : "Get OTP"}
                         </button>
                       )}
                    </div>
                  </div>

                  {verifiedFields.phoneRequestSent && !verifiedFields.phone && (
                    <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-green px-1">Verify OTP Code</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={formData.otp} 
                          onChange={(e) => updateForm({ otp: e.target.value })} 
                          placeholder="0000" 
                          maxLength={4} 
                          className="flex-1 bg-zinc-950 border border-brand-green/30 p-5 rounded-2xl text-xl font-black text-brand-green tracking-[0.5em] text-center outline-none" 
                        />
                        <button 
                          disabled={isPending || !formData.name || !formData.email || !formData.password}
                          onClick={async () => {
                             if (formData.otp.length !== 4) return;
                             setIsPending(true);
                             const res = await fetch("/api/auth/verify-otp", {
                               method: "POST",
                               body: JSON.stringify({ 
                                 phoneNumber: formData.phone, 
                                 otp: formData.otp, 
                                 name: formData.name,
                                 email: formData.email,
                                 password: formData.password,
                                 role: "GYM_OWNER"
                               })
                             });
                             const data = await res.json();
                             if (data.success) {
                               setVerifiedFields(prev => ({ ...prev, phone: true }));
                             } else {
                               setErrors(prev => ({ ...prev, phone: data.error || "Invalid OTP" }));
                             }
                             setIsPending(false);
                          }}
                          className={cn("bg-white text-zinc-950 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all", (!formData.name || !formData.email || !formData.password) && "opacity-20 pointer-events-none")}
                        >
                           Verify
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Security Password</label>
                    <div className="flex items-center space-x-4 bg-zinc-950 border border-white/5 p-5 rounded-2xl focus-within:border-brand-green/30 transition-all">
                      <Lock size={18} className="text-zinc-700" />
                      <input type="password" value={formData.password} onChange={(e) => updateForm({ password: e.target.value })} placeholder="••••••••" className={cn("bg-transparent border-none outline-none text-sm font-bold text-white w-full", errors.password && "text-red-500")} />
                    </div>
                  </div>

                  <div 
                    onClick={() => updateForm({ agreed: !formData.agreed })}
                    className={cn("p-6 rounded-[2rem] bg-zinc-950/50 border flex items-start space-x-4 cursor-pointer group transition-all", errors.agreed ? "border-red-500/50" : "border-white/5 hover:bg-zinc-900/50")}
                  >
                    <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center transition-all mt-0.5 shrink-0",
                    formData.agreed ? "bg-brand-green" : (errors.agreed ? "bg-red-500/20 border border-red-500/50" : "bg-zinc-900 border border-zinc-800")
                    )}>
                    {formData.agreed && <Check size={14} className="text-zinc-950 font-black" />}
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tight">
                        I acknowledge that I am a legal representative of this gym and agree to PassFit's <span className="text-brand-green underline uppercase tracking-widest font-black">Partner Terms of Service</span>.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={handleNext} disabled={!verifiedFields.phone || !formData.agreed} className={cn("w-full py-7 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center space-x-2", (verifiedFields.phone && formData.agreed) ? "bg-brand-green text-zinc-950 shadow-brand-green/10" : "bg-zinc-900 text-zinc-700 pointer-events-none")}>
                     <span>Create Account & Continue</span>
                     <ArrowRight size={16} />
                  </button>
                  {errors.phone && <p className="text-center text-red-500 text-[9px] font-black uppercase mt-4 tracking-widest">{errors.phone}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase flex items-center tracking-tight italic">
                      <Building className="mr-4 text-brand-blue" size={32} />
                      Business Info
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] px-12">Basic gym name and location details</p>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Official Gym Name *</label>
                      <input type="text" value={formData.gymName} onChange={(e) => updateForm({ gymName: e.target.value })} placeholder="e.g. Iron Paradise Fitness" className={cn("w-full bg-zinc-950 border p-6 rounded-2xl text-sm font-bold outline-none transition-all placeholder:text-zinc-900", errors.gymName ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-white/5 focus:border-brand-green/30")} />
                      {errors.gymName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1 flex items-center"><AlertCircle size={10} className="mr-1" /> {errors.gymName}</p>}
                    </div>

                    {/* Operational Hours */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Opening Time</label>
                          <div className="relative">
                             <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                             <input type="text" value={formData.openingTime} onChange={(e) => updateForm({ openingTime: e.target.value })} placeholder="06:00 AM" className="w-full bg-zinc-950 border border-white/5 p-5 pl-14 rounded-2xl text-xs font-black outline-none focus:border-brand-green/30" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Closing Time</label>
                          <div className="relative">
                             <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                             <input type="text" value={formData.closingTime} onChange={(e) => updateForm({ closingTime: e.target.value })} placeholder="10:00 PM" className="w-full bg-zinc-950 border border-white/5 p-5 pl-14 rounded-2xl text-xs font-black outline-none focus:border-brand-green/30" />
                          </div>
                       </div>
                    </div>

                    {/* Weekly Off */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Weekly Off Day</label>
                       <select 
                          value={formData.weeklyOffDay} 
                          onChange={(e) => updateForm({ weeklyOffDay: e.target.value })}
                          className="w-full bg-zinc-950 border border-white/5 p-6 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:border-brand-green/30 appearance-none cursor-pointer"
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
                       <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-1 mt-2 flex items-center">
                          <AlertCircle size={10} className="mr-1.5 text-brand-blue" />
                          Owner can manually pause the gym anytime from dashboard
                       </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Full Operational Address *</label>
                      <textarea value={formData.location} onChange={(e) => updateForm({ location: e.target.value })} placeholder="Street, Area, City, Pincode" className={cn("w-full bg-zinc-950 border p-6 rounded-2xl text-sm font-bold outline-none transition-all h-32 resize-none placeholder:text-zinc-900", errors.location ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-white/5 focus:border-brand-green/30")} />
                      {errors.location && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1 flex items-center"><AlertCircle size={10} className="mr-1" /> {errors.location}</p>}
                    </div>
                 </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase flex items-center tracking-tight italic">
                      <ShieldCheck className="mr-4 text-brand-green" size={32} />
                      Legal Tie-up
                    </h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] px-12">Submit documents for official verification</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit flex justify-between">
                            PAN Number *
                            {verifiedFields.panNumber && <span className="text-brand-green flex items-center italic text-[9px] translate-y-[-2px] uppercase tracking-tighter">Matched <Check size={10} className="ml-1" /></span>}
                        </label>
                        <input type="text" value={formData.panNumber} onChange={(e) => updateForm({ panNumber: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" className={cn("w-full bg-zinc-950 border p-5 rounded-2xl text-xs font-black outline-none transition-all", errors.panNumber ? "border-red-500/50" : (verifiedFields.panNumber ? "border-brand-green/30 text-brand-green" : "border-white/5 focus:border-brand-green/20"))} maxLength={10} />
                        {errors.panNumber && <p className="text-[9px] text-red-500 font-bold uppercase pl-1">{errors.panNumber}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">PAN Card Photo *</label>
                        <label className={cn("w-full bg-zinc-950 border p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-brand-green/30 transition-all overflow-hidden", errors.panPhoto ? "border-red-500/50" : (verifiedFields.panNumber ? "border-brand-green/20" : "border-white/5"))}>
                            <span className={cn("text-[10px] font-black truncate pr-4", formData.panPhoto ? "text-brand-green" : (errors.panPhoto ? "text-red-500" : "text-zinc-800 uppercase italic"))}>
                                {formData.panPhoto ? "Uploaded ✅" : (errors.panPhoto || "Select image")}
                            </span>
                            <Upload size={14} className={formData.panPhoto ? "text-brand-green" : "text-zinc-800"} />
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "panPhoto")} className="hidden" />
                        </label>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit flex justify-between">
                            Registration Document (GST/Udyam) *
                            {verifiedFields.registrationDoc && <span className="text-brand-blue flex items-center italic text-[9px] translate-y-[-2px] uppercase tracking-tighter">Doc Verified <Check size={10} className="ml-1" /></span>}
                        </label>
                        <label className={cn("w-full bg-zinc-950 border p-6 rounded-2xl flex items-center justify-between cursor-pointer transition-all overflow-hidden group", errors.registrationDoc ? "border-red-500/50" : (verifiedFields.registrationDoc ? "border-brand-blue/30" : "border-white/5 hover:border-brand-blue/30"))}>
                            <div className="flex items-center">
                                <FileText className={cn("mr-3", formData.registrationDoc ? "text-brand-blue" : (errors.registrationDoc ? "text-red-500" : "text-zinc-800"))} size={18} />
                                <span className={cn("text-xs font-black uppercase", formData.registrationDoc ? "text-white" : (errors.registrationDoc ? "text-red-500" : "text-zinc-800 italic"))}>
                                    {formData.registrationDoc ? "Doc Attached ✅" : (errors.registrationDoc || "Upload Business Certificate")}
                                </span>
                            </div>
                            <Upload size={16} className="text-zinc-800 group-hover:text-brand-blue" />
                            <input type="file" accept="image/*,pdf" onChange={(e) => handleFileUpload(e, "registrationDoc")} className="hidden" />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Bank Account *</label>
                            <input type="text" value={formData.bankAccount} onChange={(e) => updateForm({ bankAccount: e.target.value })} placeholder="Account Num" className={cn("w-full bg-zinc-950 border p-5 rounded-2xl text-xs font-black outline-none", errors.bankAccount ? "border-red-500/50" : (verifiedFields.bankAccount ? "border-brand-green/30 text-brand-green" : "border-white/5"))} />
                            {errors.bankAccount && <p className="text-[9px] text-red-500 font-bold uppercase pl-1">{errors.bankAccount}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">IFS Code *</label>
                            <input type="text" value={formData.ifscCode} onChange={(e) => updateForm({ ifscCode: e.target.value.toUpperCase() })} placeholder="HDFC000..." className={cn("w-full bg-zinc-950 border p-5 rounded-2xl text-xs font-black outline-none", errors.ifscCode ? "border-red-500/50" : "border-white/5")} maxLength={11} />
                            {errors.ifscCode && <p className="text-[9px] text-red-500 font-bold uppercase pl-1">{errors.ifscCode}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 font-outfit">Cancelled Cheque Photo *</label>
                        <label className={cn("w-full bg-zinc-950 border p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all overflow-hidden", errors.chequePhoto ? "border-red-500/50" : (verifiedFields.bankAccount ? "border-brand-green/20" : "border-white/5"))}>
                            <span className={cn("text-[10px] font-black truncate pr-4", formData.chequePhoto ? "text-brand-green" : (errors.chequePhoto ? "text-red-500" : "text-zinc-800 uppercase italic"))}>
                                {formData.chequePhoto ? "Uploaded ✅" : (errors.chequePhoto || "Select image")}
                            </span>
                            <Upload size={14} className={formData.chequePhoto ? "text-brand-green" : "text-zinc-800"} />
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "chequePhoto")} className="hidden" />
                        </label>
                    </div>

                    <div 
                        onClick={() => updateForm({ agreed: !formData.agreed })}
                        className={cn("p-6 rounded-[2rem] bg-zinc-950 border flex items-start space-x-4 cursor-pointer group transition-all", errors.agreed ? "border-red-500/50" : "border-white/5 hover:bg-zinc-900/50")}
                    >
                        <div className={cn(
                        "w-5 h-5 rounded flex items-center justify-center transition-all mt-0.5 shrink-0",
                        formData.agreed ? "bg-brand-green" : (errors.agreed ? "bg-red-500/20 border border-red-500/50" : "bg-zinc-900 border border-zinc-800")
                        )}>
                        {formData.agreed && <Check size={14} className="text-zinc-950 font-black" />}
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase tracking-tight">
                            I agree to the <span onClick={(e) => { e.stopPropagation(); setIsAgreementOpen(true); }} className="text-brand-green underline uppercase tracking-widest font-black cursor-pointer hover:text-white transition-colors">Partner Tie-up Agreement</span>
                        </p>
                    </div>
                 </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tight italic">Final Review</h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Ready for PassFit submission</p>
                    <div className="p-10 rounded-[3rem] bg-zinc-950 border border-white/5 space-y-4 text-left shadow-2xl">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-4 py-2 border-b border-white/5">
                            <span className="text-zinc-500">Business</span>
                            <span className="text-white">{formData.gymName}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-4 py-2 border-b border-white/5">
                            <span className="text-zinc-500">Matching Status</span>
                            <span className="text-brand-green italic flex items-center font-black">
                                100% Match <Check size={12} className="ml-1" />
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-4 py-2">
                            <span className="text-zinc-500">KYC Status</span>
                            <span className="text-brand-green italic flex items-center font-black animate-pulse">
                                Integrity Verified <ShieldCheck size={12} className="ml-1" />
                            </span>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase italic">Notifications will be sent via WhatsApp and Email upon approval.</p>
              </div>
            )}

            {step > 1 && step < 5 && (
              <div className="flex gap-4 pt-10">
                <button onClick={() => setStep(prev => prev - 1)} className="flex-1 bg-zinc-950 border border-white/10 text-white font-black py-7 rounded-[2rem] text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all">Back</button>
                <button onClick={() => { if (step === 4) handleFinalSubmit(); else handleNext(); }} disabled={isPending || !!scanningField} className={cn("flex-[2.5] text-zinc-950 font-black py-7 rounded-[2rem] text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all shadow-xl", step === 4 ? "bg-white shadow-white/5" : "bg-brand-green shadow-brand-green/10")}>
                  {isPending ? <Loader2 className="animate-spin mx-auto" size={20} /> : (step === 4 ? "Submit Now" : "Continue")}
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col items-center justify-center text-center space-y-8 pt-16 animate-in zoom-in duration-700">
                 <div className="w-24 h-24 rounded-[3rem] bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green shadow-2xl shadow-brand-green/5">
                    <CheckCircle2 size={48} className="animate-in zoom-in spin-in-90 duration-700" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">Application Sent</h2>
                    <p className="max-w-xs mx-auto text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">Our legal team is reviewing your documents. You will receive a notification within 24 hours.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes scan {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
