import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { GoogleMapsProvider } from "@/components/providers/GoogleMapsProvider";
import { AuthProvider } from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "PassFit | Gym Day Pass & Premium Fitness Hubs Near Me",
    template: "%s | PassFit Gym Day Pass"
  },
  description: "Find and book premium gym day passes near you with PassFit. Instant access to elite fitness hubs, no commitments.",
  keywords: ["gym day pass", "gym near me", "fitness hubs", "daily gym access", "PassFit"],
  authors: [{ name: "PassFit Team" }],
  creator: "AICLEX TECHNOLOGIES",
  publisher: "AICLEX TECHNOLOGIES",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://passfit.in",
    siteName: "PassFit",
    title: "PassFit | Gym Day Pass & Fitness Hubs Near Me",
    description: "Instant daily access to premium gyms. No subscriptions, just fitness.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
    <html lang="en" className="light" suppressHydrationWarning>
      <body 
        className={`${outfit.variable} ${inter.variable} font-outfit antialiased text-slate-900 selection:bg-brand-green/30 tracking-tight`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <GoogleMapsProvider>
            {children}
          </GoogleMapsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
