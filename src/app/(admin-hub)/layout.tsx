import React from "react";

export default function AdminHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {children}
    </div>
  );
}
