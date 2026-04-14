import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherData } from '@/lib/meteoblue';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    const data = await fetchWeatherData({ city });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch weather' }, { status: 500 });
  }
}
