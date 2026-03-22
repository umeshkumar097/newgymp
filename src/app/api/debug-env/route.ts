import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasUrl: !!process.env.DATABASE_URL,
    urlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 10) : "missing",
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),
  });
}
