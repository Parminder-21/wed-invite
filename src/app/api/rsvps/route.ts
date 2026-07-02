import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyAuthRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = verifyAuthRequest(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const attendingParam = searchParams.get('attending');
  const exportParam = searchParams.get('export');

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
    ];
  }

  if (attendingParam === 'true') {
    where.attending = true;
  } else if (attendingParam === 'false') {
    where.attending = false;
  }

  try {
    const rsvps = await prisma.rSVP.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (exportParam === 'csv') {
      const headers = ['ID', 'Name', 'Phone', 'Email', 'Attending', 'Guests Count', 'Meal Preference', 'Events Attending', 'Song Request', 'Advice', 'Created At'];
      const rows = rsvps.map((r) => {
        let events = '';
        try {
          events = JSON.parse(r.eventsAttending).join(', ');
        } catch (e) {
          events = r.eventsAttending;
        }

        return [
          r.id,
          `"${(r.name || '').replace(/"/g, '""')}"`,
          `"${(r.phone || '').replace(/"/g, '""')}"`,
          r.email ? `"${r.email.replace(/"/g, '""')}"` : '',
          r.attending ? 'Yes' : 'No',
          r.guestsCount,
          r.mealPreference ? `"${r.mealPreference.replace(/"/g, '""')}"` : '',
          `"${events.replace(/"/g, '""')}"`,
          r.songRequest ? `"${r.songRequest.replace(/"/g, '""')}"` : '',
          r.advice ? `"${r.advice.replace(/"/g, '""')}"` : '',
          r.createdAt.toISOString(),
        ];
      });

      const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="wedding_rsvps.csv"',
        },
      });
    }

    return NextResponse.json(rsvps);
  } catch (error) {
    console.error('RSVPs list API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve RSVPs.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = verifyAuthRequest(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'RSVP ID is required.' }, { status: 400 });
    }

    await prisma.rSVP.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('RSVP delete error:', error);
    return NextResponse.json({ error: 'Failed to delete RSVP response.' }, { status: 500 });
  }
}
