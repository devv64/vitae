import Event from '@/models/Event';

export async function GET(req) {
    try {
        const events = await Event.find();
        return new Response(JSON.stringify(events), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Error retrieving events", { status: 500 });
    }
}

export async function POST(req) {
    try {
        const eventData = await req.json();
        const newEvent = new Event(eventData);
        await newEvent.save();
        return new Response(JSON.stringify(newEvent), { status: 201 });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return new Response(JSON.stringify({ message: error.message }), { status: 400 });
        }
        return new Response("Error creating event", { status: 500 });
    }
}