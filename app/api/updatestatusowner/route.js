import OwnerDetails from "@/models/OwnerDetails"; 
import { connectMongoDB } from "@/lib/mongodb";

export async function PUT(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.error("ID is missing from the request");
      return new Response('Missing ID', { status: 400 });
    }

    const owner = await OwnerDetails.findById(id);
    if (!owner) {
      console.error(`Owner with ID ${id} not found`);
      return new Response('Owner not found', { status: 404 });
    }

    const updatedData = await req.json();
    if (!updatedData.status) {
      console.error("No status provided in the request body");
      return new Response('Missing status in the request body', { status: 400 });
    }
    
    owner.status = updatedData.status; // Update the status field
    await owner.save();

    console.log(`Successfully updated owner with ID ${id} to status: ${owner.status}`);
    return new Response(JSON.stringify(owner), { status: 200 });
  } catch (error) {
    console.error("Error updating owner details:", error);
    return new Response('Failed to update owner details', { status: 500 });
  }
}
