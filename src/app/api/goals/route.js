import Goals from '@/models/Goals';

export async function GET(req) {
    try {
        const goals = await Goals.find();
        return new Response(JSON.stringify(goals), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Error retrieving goals", { status: 500 });
    }
}

export async function POST(req) {
    try {
        const goalData = await req.json();
        const newGoal = new Goals(goalData);
        await newGoal.save();
        return new Response(JSON.stringify(newGoal), { status: 201 });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return new Response(JSON.stringify({ message: error.message }), { status: 400 });
        }
        return new Response("Error creating goal", { status: 500 });
    }
}