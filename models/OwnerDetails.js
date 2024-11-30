import mongoose from 'mongoose';

// OwnerDetails schema
const ownerDetailsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure this is correct
    image: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    nicNumber: { type: String, required: true },
    status: { type: String, default: 'Active' },
    createDate: { type: Date, default: Date.now },
    selectcanteen: { type: String, default: 'Inactive' },
    password: { type: String, required: true } // Ensure this is correct
  },
  { timestamps: true }
);

const OwnerDetails = mongoose.models.OwnerDetails || mongoose.model('OwnerDetails', ownerDetailsSchema);

export default OwnerDetails;
