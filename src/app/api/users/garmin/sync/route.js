// sync/route.js

import { NextResponse } from "next/server";
import { fetchGarminData, refreshGarminToken } from "@/services/garmin"; // Helper services for fetching and refreshing tokens

export async function POST(request) {
  let accessToken = process.env.GARMIN_ACCESS_TOKEN;
  let refreshToken = process.env.GARMIN_REFRESH_TOKEN;

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: "Garmin connection details missing" },
      { status: 500 }
    );
  }

  try {
    // Check if the token needs refreshing (hardcoded example without checking expiration for simplicity)
    const garminData = await fetchGarminData(accessToken);

    // Return the Garmin data without saving it
    return NextResponse.json({
      message: "Garmin data synced",
      activities: garminData.activities,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to sync Garmin data" },
      { status: 500 }
    );
  }
}
