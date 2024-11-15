// app/api/verify-signer/route.ts
import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";

export async function POST(request: NextRequest) {
  const { signerUuid, fid } = await request.json();

  try {
    const { fid: userFid } = await neynarClient.lookupSigner(signerUuid);
    
    const isVerifiedUser = userFid === Number(fid);
    
    return NextResponse.json({ 
      verified: isVerifiedUser 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      error: "Verification failed" 
    }, { status: 400 });
  }
}