import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authParams = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
    });

    // Spread authParams so 'token', 'signature', and 'expire' 
    // are at the root of the JSON object.
    return NextResponse.json({ ...authParams });
    
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    return NextResponse.json(
      { error: "Authentication for ImageKit failed" },
      { status: 500 }
    );
  }
}
