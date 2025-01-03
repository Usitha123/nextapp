import mongoose from 'mongoose';
const { Schema } = mongoose;

const mealSchema = new Schema({
  mealId: {
    type: String,
    required: true
  },
  mealName: {
    type: String,
    required: true
  },
  mealQuantity: {
    type: Number,
    required: true
  },
  mealPrice: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now  // Automatically sets the timestamp when the meal is created
  }
});

const orderSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true
  },
  canteenName: {
    type: String,
    required: true,
    trim: true
  },
  mealType: {
    type: String,
    required: true,
    enum: ['Veg', 'Non-Veg', 'Vegan', 'Other'] // Optional, can be customized
  },
  meals: [mealSchema],  // Updated meal field to plural for clarity
  mealStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Accepted', 'Cancelled', 'Picked'] // Ensure only valid statuses
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
