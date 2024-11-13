import mongoose from 'mongoose';

const canteenSchema = new mongoose.Schema({
  canteenName: {
    type: String,
    required: true,
  },
  businessEmail: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Email validation regex
  },
  openHour: {
    type: String,
    required: true,
  },
  closedHour: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // 10 digits phone number
  },
  image: {
    type: String, // URL of the image
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active',
  },
  openingDate: {
    type: Date,
    required: true,
  },
  ownerstatus: {
    type: String,
    enum: ['Inactive', 'Active'],
    default: 'Inactive', // Default owner status
  },
});

const Canteen = mongoose.models.Canteen || mongoose.model('Canteen', canteenSchema);

export default Canteen;
