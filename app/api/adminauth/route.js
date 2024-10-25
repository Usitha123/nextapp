import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  const { email, password } = await request.json();
  console.log("Received email:", email);
  console.log("Received password:", password);

  // Validate request body
  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "Email and password are required." }),
      { status: 400 }
    );
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db('yourDatabaseName'); // Replace with your actual database name
    const admins = database.collection('admins'); // Replace with your actual collection name

    // Find the admin by email
    const admin = await admins.findOne({ email });

    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials." }),
        { status: 401 }
      );
    }

    // Validate password (direct comparison)
    if (admin.password !== password) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials." }),
        { status: 401 }
      );
    }

    // If login is successful, return a success response
    return new Response(
      JSON.stringify({ message: "Login successful." }),
      { status: 200 } // You might want to use a redirect instead
    );

    // Optional: Uncomment the following lines to redirect to the dashboard
    // return Response.redirect('/admindashboard', 302);

  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
