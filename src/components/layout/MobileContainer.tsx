"use client";

import React from "react";

interface MobileContainerProps {
  children: React.ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="w-full min-h-screen relative flex flex-col transition-all duration-500">
      <div className="flex-1 w-full max-w-md mx-auto md:max-w-none bg-zinc-900 md:bg-transparent shadow-2xl md:shadow-none min-h-screen">
        {children}
      </div>
    </div>
  );
}
