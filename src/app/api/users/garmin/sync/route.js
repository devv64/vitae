// /app/api/users/sync-garmin/route.js

import { NextResponse } from 'next/server';
import User from '@/models/User';
import { fetchGarminData } from '@/services/garmin';

export async function POST(request) {
  const { userId } = await request.json();
  
  const user = await User.findById(userId);
  if (!user || !user.garminConnection.accessToken) {
    return NextResponse.json({ error: 'User or Garmin connection not found' }, { status: 404 });
  }

  const garminData = await fetchGarminData(user.garminConnection.accessToken);

  user.garminConnection.activities.push(...garminData.activities);
  user.garminConnection.lastSynced = new Date();
  await user.save();

  return NextResponse.json({ message: 'Garmin data synced', activities: garminData.activities });
}
