import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    faculty: { type: String, required: true },  // New field for faculty
    phoneNumber: { type: String, required: true }, // New field for phone number
    nicNumber: { type: String, required: true },
    status: { type: String, default: 'active' },  // Default status as active
   
  },
  { timestamps: true } // This will add createdAt and updatedAt
);

export default mongoose.models.User || mongoose.model('User', userSchema);
