import { NextResponse } from "next/server";
import { s3Client } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json();

    const key = `gyms/${Date.now()}-${filename}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "passfit-media",
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ 
      uploadUrl: url, 
      imageUrl: `${process.env.R2_PUBLIC_DOMAIN}/${key}` 
    });
  } catch (error: any) {
    console.error("Upload URL Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
