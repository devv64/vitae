// Import necessary modules
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

console.log('MongoDB URI:', uri);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function GET(request) {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    return new Response(JSON.stringify({ message: 'Successfully connected to MongoDB!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return new Response(JSON.stringify({ message: 'Failed to connect to MongoDB', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await client.close();
  }
}
