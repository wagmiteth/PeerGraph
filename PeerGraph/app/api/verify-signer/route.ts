// app/api/verify-signer/route.ts
import { NextRequest, NextResponse } from "next/server";
import neynarClient from "@/clients/neynar";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body); // Debug log

    const { signerUuid, fid } = body;
    
    if (!signerUuid) {
      console.error('Missing signerUuid');
      return NextResponse.json({ 
        error: "Missing signerUuid",
        verified: false 
      }, { status: 400 });
    }

    if (!fid) {
      console.error('Missing fid');
      return NextResponse.json({ 
        error: "Missing fid",
        verified: false 
      }, { status: 400 });
    }

    console.log('Attempting Neynar lookup with:', { signerUuid, fid });

    // Get signer details from Neynar
    const signer = await neynarClient.lookupSigner(signerUuid);
    console.log('Neynar API response:', signer);

    if (!signer) {
      return NextResponse.json({ 
        error: "Signer not found",
        verified: false 
      }, { status: 400 });
    }

    const isVerified = signer.fid === Number(fid);
    console.log('Verification result:', { 
      signerFid: signer.fid, 
      providedFid: fid, 
      isVerified 
    });

    return NextResponse.json({ 
      verified: isVerified,
      signer: signer 
    }, { status: isVerified ? 200 : 400 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Verification failed",
      verified: false 
    }, { status: 400 });
  }
}