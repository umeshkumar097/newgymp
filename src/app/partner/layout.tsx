import React from "react";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans antialiased text-zinc-100 flex flex-col">
      <header className="px-6 py-4 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <h1 className="text-xl font-black font-outfit tracking-tight">
          PassFit <span className="text-brand-green italic">Partner</span>
        </h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
