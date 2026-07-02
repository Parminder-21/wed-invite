import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, phone, email, attending, guestsCount, mealPreference, eventsAttending, songRequest, advice } = data;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone number are required.' }, { status: 400 });
    }

    const rsvp = await prisma.rSVP.create({
      data: {
        name,
        phone,
        email: email || null,
        attending: Boolean(attending),
        guestsCount: attending ? Number(guestsCount) || 1 : 0,
        mealPreference: attending ? mealPreference || null : null,
        eventsAttending: JSON.stringify(eventsAttending || []),
        songRequest: songRequest || null,
        advice: advice || null,
      },
    });

    return NextResponse.json({ success: true, id: rsvp.id });
  } catch (error) {
    console.error('RSVP API submission error:', error);
    return NextResponse.json({ error: 'Failed to record RSVP response.' }, { status: 500 });
  }
}
