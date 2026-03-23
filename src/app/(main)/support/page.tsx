import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SupportForm } from "./SupportForm";
import { HelpCircle, ShieldAlert } from "lucide-react";

export default async function SupportPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-outfit p-6 md:p-12 lg:p-24 space-y-16">
      <div className="max-w-4xl mx-auto space-y-16">
        
        <div className="space-y-6 text-center lg:text-left">
           <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
              <ShieldAlert size={14} className="text-red-500" />
              <span className="text-[10px] font-black text-red-500 tracking-[0.2em] uppercase">PassFit Dispute Unit</span>
           </div>
           <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">SUPPORT<br/><span className="text-zinc-800">CENTER</span></h1>
           <p className="text-zinc-500 text-sm max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed lowercase">
              Need to resolve a payment mismatch or access issue? Submit your dispute below and our elite support engineers will prioritize your case instantly.
           </p>
        </div>

        <SupportForm userId={userId} />

      </div>
    </div>
  );
}
