import mongoose from 'mongoose';

// Cashier schema
const cashierSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure this is correct
    image: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    nicNumber: { type: String, required: true },
    status: { type: String, default: 'Active' },
    selectCanteen: { type: String, default: 'Inactive' },
    password: { type: String, required: true } // Ensure this is correct
  },
  { timestamps: true }
);

const Cashier = mongoose.models.Cashier || mongoose.model('Cashier', cashierSchema);

export default Cashier;
