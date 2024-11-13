import { connectMongoDB } from "@/lib/mongodb"; // Utility to connect to the database
import Canteen from '@/models/Canteen';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Connect to the database
      await connectMongoDB();

      const {
        canteenName,
        businessEmail,
        openHour,
        closedHour,
        phoneNumber,
        status,
        canteenImageURL,
        ownerDetails,
      } = req.body;

      // Create a new canteen document
      const canteen = new Canteen({
        canteenName,
        businessEmail,
        openHour,
        closedHour,
        phoneNumber,
        status,
        canteenImageURL,
        owner: {
          firstName: ownerDetails.firstName,
          lastName: ownerDetails.lastName,
          contactNumber: ownerDetails.contactNumber,
          ownerEmail: ownerDetails.ownerEmail,
          nic: ownerDetails.nic,
          password: ownerDetails.password, // Password should be hashed before storing
          ownerImageURL: ownerDetails.ownerImageURL,
        },
      });

      // Save the document to MongoDB
      await canteen.save();

      return res.status(201).json({ message: 'Canteen and owner created successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error creating canteen and owner' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
