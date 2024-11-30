import { connectMongoDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import CanteenOwner from "@/models/OwnerDetails";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function authenticateUser(email, password) {
  await connectMongoDB();
  
  // Check Admin Model
  let user = await Admin.findOne({ email });
  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return {
        id: user._id,
        email: user.email,
        role: 'admin',
        name: user.firstName,
        model: 'Admin'
      };
    }
  }

  // Check CanteenOwner Model
  user = await CanteenOwner.findOne({ email });
  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return {
        id: user._id,
        email: user.email,
        role: 'canteenOwner',
        name: user.firstName,
        model: 'CanteenOwner'
      };
    }
  }

  // Check User Model
  user = await User.findOne({ email });
  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return {
        id: user._id,
        email: user.email,
        role: 'user',
        name: user.firstName,
        model: 'User'
      };
    }
  }

  return null;
}