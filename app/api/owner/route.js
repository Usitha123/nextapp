// app/api/owner/route.js

import { connectMongoDB } from "@/lib/mongodb";
import Owner from "@/models/Owner";

export async function POST(req, res) {
    await connectMongoDB();

    try {
        const owner = new Owner(await req.json());  // For Next.js 13/14, use req.json() for parsing JSON body
        await owner.save();
        return new Response(JSON.stringify({ success: true, data: owner }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
    }
}

// If you want to handle GET or other HTTP methods, you can add similar handlers here.
