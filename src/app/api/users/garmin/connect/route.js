import { NextResponse } from 'next/server';
import User from '@/models/User';

export async function POST(request) {
  const { userId, accessToken, refreshToken } = await request.json();
  
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  user.garminConnection = { accessToken, refreshToken, lastSynced: new Date() };
  await user.save();

  return NextResponse.json({ message: 'Garmin connected' });
}
