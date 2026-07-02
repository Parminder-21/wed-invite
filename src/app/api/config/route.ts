import { NextRequest, NextResponse } from 'next/server';
import { getWeddingConfig, saveWeddingConfig } from '@/lib/config';
import { verifyAuthRequest } from '@/lib/auth';

export async function GET() {
  const config = await getWeddingConfig();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  const admin = verifyAuthRequest(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const success = await saveWeddingConfig(data);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
    }
  } catch (error) {
    console.error('Config API error:', error);
    return NextResponse.json({ error: 'Invalid config input' }, { status: 400 });
  }
}
