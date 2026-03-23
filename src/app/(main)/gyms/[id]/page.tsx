import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, Star, MapPin, Share2, Heart, ShieldCheck, 
  Zap, Info, Shield, ArrowRight, CheckCircle2, Clock 
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GymDetailClient } from "./GymDetailClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const gym = await prisma.gym.findUnique({
    where: { id: resolvedParams.id },
    select: { name: true, location: true, description: true }
  });

  if (!gym) return { title: "Hub Not Found" };

  return {
    title: `${gym.name} | Gym Day Pass in ${gym.location}`,
    description: `Book a daily pass at ${gym.name} in ${gym.location}. ${gym.description?.slice(0, 160)}... Access elite fitness facilities with PassFit.`,
    keywords: [`gym day pass ${gym.location}`, `best gym in ${gym.location}`, gym.name, "fitness hub", "PassFit"],
    openGraph: {
      title: `${gym.name} - Premium Hub Access`,
      description: `Get instant daily access to ${gym.name} in ${gym.location} via PassFit. No membership needed.`,
    }
  };
}

export default async function GymDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const gym = await prisma.gym.findUnique({
    where: { id: resolvedParams.id },
    include: {
      plans: true,
      owner: {
        select: { name: true }
      }
    }
  });

  if (!gym) {
    notFound();
  }

  return <GymDetailClient gym={gym} />;
}
