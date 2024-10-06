import Event from '@/models/Event';
import connectDB from '@/utils/mongodb';

await connectDB();

export async function GET(req) {
    try {
        const events = await Event.find();
        return new Response(JSON.stringify(events), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error retrieving events", error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function POST(req) {
    try {
        let eventData = await req.json();

        console.log('eventData:', eventData);

        // Validate eventData before creating a new event
        if (!eventData.title || !eventData.start || !eventData.end) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const newEvent = new Event(eventData);
        await newEvent.save();
        return new Response(JSON.stringify(newEvent), { status: 201, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error creating event:', error);
        if (error.name === 'ValidationError') {
            return new Response(JSON.stringify({ message: error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ message: "Error creating event", error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
