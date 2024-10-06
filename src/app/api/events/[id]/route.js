import Event from '@/models/Event';

export async function GET(req, { params }) {
    const { id } = params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return new Response("Event not found", { status: 404 });
        }
        return new Response(JSON.stringify(event), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Error retrieving event", { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    try {
        const eventData = await req.json();
        const updatedEvent = await Event.findByIdAndUpdate(id, eventData, { new: true, runValidators: true });
        if (!updatedEvent) {
            return new Response("Event not found", { status: 404 });
        }
        return new Response(JSON.stringify(updatedEvent), { status: 200 });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return new Response(JSON.stringify({ message: error.message }), { status: 400 });
        }
        return new Response("Error updating event", { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return new Response("Event not found", { status: 404 });
        }
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(error);
        return new Response("Error deleting event", { status: 500 });
    }
}
