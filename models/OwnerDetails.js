// models/OwnerDetails.js
import mongoose from 'mongoose';

const ownerDetailsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    ownerEmail: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    nicNumber: { type: String, required: true },
    status: { type: String, default: 'Active' }, // Default 'Active'
    createDate: { type: Date, default: Date.now },
    selectcanteen: { type: String, default: 'Inactive' },  // Default 'Inactive'
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
  },
  { timestamps: true }
);

const OwnerDetails = mongoose.models.OwnerDetails || mongoose.model('OwnerDetails', ownerDetailsSchema);

export default OwnerDetails;
