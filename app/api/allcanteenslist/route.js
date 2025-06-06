// app/api/allcanteenslist/route.js
import Canteen from '../../../models/Canteen';
import { connectMongoDB } from '@/lib/mongodb';

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      const canteens = await Canteen.find();
      return new Response(JSON.stringify(canteens), { status: 200 });
    }

    const canteen = await Canteen.findById(id);
    if (!canteen) {
      return new Response('Canteen not found', { status: 404 });
    }

    return new Response(JSON.stringify(canteen), { status: 200 });
  } catch (error) {
    return new Response('Error fetching canteen details', { status: 500 });
  }
}
