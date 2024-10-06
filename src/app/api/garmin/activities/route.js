import { GarminConnect } from "garmin-connect";
import dotenv from "dotenv";

dotenv.config();

export async function GET(req) {
  try {
    console.log("Attempting to login to Garmin Connect...");

    const GCClient = new GarminConnect({
      username: process.env.GARMIN_USERNAME,
      password: process.env.GARMIN_PASSWORD,
    });

    // Login to Garmin
    await GCClient.login();
    console.log("Successfully logged into Garmin Connect.");

    // Fetch Garmin activities
    const activities = await GCClient.getHeartRate();
    console.log("Fetched activities:", activities);

    // Return the activities as a response
    return new Response(JSON.stringify(activities), { status: 200 });
  } catch (error) {
    console.error("Error fetching Garmin activities:", error);

    // Return an error response
    return new Response("Error fetching Garmin activities", { status: 500 });
  }
}

export async function POST(req) {
  try {
    // This is just a placeholder, as Garmin API typically doesn't allow posting activities.
    const data = await req.json();
    console.log("Received POST data:", data);

    // You can add logic here if Garmin allows posting data or if you're saving something else.
    return new Response(
      JSON.stringify({
        message: "POST operation is not supported for activities",
      }),
      { status: 405 }
    );
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response("Error handling POST request", { status: 500 });
  }
}
