import Goals from '@/models/Goals';

export async function GET(req, { params }) {
    const { id } = params;
    try {
        const goal = await Goals.findById(id);
        if (!goal) {
            return new Response("Goal not found", { status: 404 });
        }
        return new Response(JSON.stringify(goal), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Error retrieving goal", { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    try {
        const goalData = await req.json();
        const updatedGoal = await Goals.findByIdAndUpdate(id, goalData, { new: true, runValidators: true });
        if (!updatedGoal) {
            return new Response("Goal not found", { status: 404 });
        }
        return new Response(JSON.stringify(updatedGoal), { status: 200 });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return new Response(JSON.stringify({ message: error.message }), { status: 400 });
        }
        return new Response("Error updating goal", { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        const deletedGoal = await Goals.findByIdAndDelete(id);
        if (!deletedGoal) {
            return new Response("Goal not found", { status: 404 });
        }
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error(error);
        return new Response("Error deleting goal", { status: 500 });
    }
}