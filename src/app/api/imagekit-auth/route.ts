import { NextResponse } from 'next/server';
import { getImageKit } from '@/lib/imagekit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ik = getImageKit();
    
    // Check if the instance was properly initialized
    // @ts-ignore - access internal config for check
    const config = ik.options;
    if (config.publicKey === "missing" || config.privateKey === "missing") {
      console.error("❌ ImageKit is not configured on the server. Check your environment variables.");
      return NextResponse.json(
        { error: 'ImageKit server-side configuration is missing' }, 
        { status: 501 }
      );
    }

    const authParameters = ik.getAuthenticationParameters();
    return NextResponse.json(authParameters);
  } catch (error: any) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate auth' }, 
      { status: 500 }
    );
  }
}
