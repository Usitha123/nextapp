// models/Owner.js

import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  nicNumber: { type: String, required: true },
  imageURL: { type: String, required: true },
});

export default mongoose.models.Owner || mongoose.model('Owner', OwnerSchema);
