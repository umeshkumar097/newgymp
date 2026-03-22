"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Ticket, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore", href: "/explore", icon: Search },
  { name: "Passes", href: "/passes", icon: Ticket },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Profile", href: "/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-800 pb-safe pt-2 px-4 shadow-lg z-50 md:hidden">
      <div className="flex justify-between items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-300",
                isActive ? "text-orange-500 scale-110" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide uppercase">
                {item.name}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
