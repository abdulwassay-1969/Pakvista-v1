import { NextResponse } from 'next/server';
import { getImageKit } from '@/lib/imagekit';

export async function GET() {
  try {
    const pub = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const priv = process.env.IMAGEKIT_PRIVATE_KEY;
    console.log(`[ImageKit-Auth] Verification - Pub: ${pub ? '✅' : '❌'}, Priv: ${priv ? '✅' : '❌'}`);

    const authenticationParameters = getImageKit().getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json({ error: 'Failed to generate auth parameters' }, { status: 500 });
  }
}
