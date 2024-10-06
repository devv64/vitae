// connect/route.js

import { NextResponse } from "next/server";

export async function POST(request) {
  const { accessToken, refreshToken } = process.env; // Load from env file

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: "Garmin connection details missing" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Garmin connected",
    accessToken,
    refreshToken,
  });
}
