import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { GoogleMapsProvider } from "@/components/providers/GoogleMapsProvider";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user data for the header
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  
  const user = userId 
    ? await prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
    : null;

  const initials = user?.name 
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "JD";

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top Navigation */}
      <Header userInitials={initials} isLoggedIn={!!user} />

      {/* Main Content Area */}
      <MobileContainer>
        <main className="flex-1 w-full pt-20 md:pt-24 pb-24 md:pb-0 overflow-y-auto scrollbar-hide">
          {children}
        </main>
        {/* Desktop Footer */}
        <div className="hidden md:block">
          <Footer />
        </div>
        {/* Bottom Nav for mobile only */}
        <BottomNav />
      </MobileContainer>
    </div>
  );
}
