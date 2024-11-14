import Canteen from '../../../models/Canteen';
import { connectMongoDB } from '@/lib/mongodb';

export async function PUT(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Missing ID', { status: 400 });
    }

    const canteen = await Canteen.findById(id);
    if (!canteen) {
      return new Response('Canteen not found', { status: 404 });
    }

    const updatedData = await req.json();
    await canteen.updateOne(updatedData);

    return new Response(JSON.stringify(canteen), { status: 200 });
  } catch (error) {
    return new Response('Failed to update canteen', { status: 500 });
  }
}
