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
