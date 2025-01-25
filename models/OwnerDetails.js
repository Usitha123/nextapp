// models/OwnerDetails.js

import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // Optional: Regex to validate email format
  },
  status: {
    type: String,
    default: 'Active',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  nicNumber: {
    type: String,
    required: true,
  },
  selectcanteen: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Ensure email uniqueness and index
ownerSchema.index({ email: 1 }, { unique: true });

const Owner = mongoose.models.Owner || mongoose.model('Owner', ownerSchema);

export default Owner;
