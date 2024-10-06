import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(request) {
  try {
    await client.connect();
    const db = client.db("prod");
    const collection = db.collection("myNewCollection");

    const result = await collection.insertOne({ name: "Sample Document" });

    return new Response(JSON.stringify({ message: "Database and collection created successfully!", result }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error creating database" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } finally {
    await client.close();
  }
}
