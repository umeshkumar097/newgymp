import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleMapsProvider } from "@/components/providers/GoogleMapsProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "PassFit | Premium Gym Marketplace - Instant Access",
  description: "Discover, compare, and book premium gyms near you with flexible day passes. No long-term commitments, just pure fitness.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PassFit",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${inter.variable} font-outfit antialiased text-zinc-100 selection:bg-orange-500/30 tracking-tight`}>
        <GoogleMapsProvider>
          <div className="min-h-screen bg-zinc-950 flex flex-col">
            {/* Top Navigation */}
            <Header />

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
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
