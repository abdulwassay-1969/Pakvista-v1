import { NextResponse } from 'next/server';
import { getImageKit } from '@/lib/imagekit';

export async function GET() {
  try {
    const authenticationParameters = getImageKit().getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json({ error: 'Failed to generate auth' }, { status: 500 });
  }
}
