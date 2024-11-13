import mongoose from 'mongoose';

const canteenSchema = new mongoose.Schema({
  canteenName: {
    type: String,
    required: true,
  },
  businessEmail: {
    type: String,
    required: true,
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
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active',
  },
  canteenImageURL: {
    type: String,
    required: true,
  },
  owner: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ownerImageURL: {
      type: String,
      required: true,
    },
  },
});

const Canteen = mongoose.models.Canteen || mongoose.model('Canteen', canteenSchema);

export default Canteen;
