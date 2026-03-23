import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://passfit.in";

  // Fetch all approved gyms
  const gyms = await prisma.gym.findMany({
    where: { status: "APPROVED" },
    select: { id: true, updatedAt: true }
  });

  const gymUrls = gyms.map((gym) => ({
    url: `${baseUrl}/gyms/${gym.id}`,
    lastModified: gym.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticPages = [
    "",
    "/about",
    "/contact",
    "/explore",
    "/privacy",
    "/terms",
    "/refund",
    "/support",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.5,
  }));

  return [...staticPages, ...(gymUrls as any)];
}
