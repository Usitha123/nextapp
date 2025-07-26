import mongoose from 'mongoose';
const { Schema } = mongoose;

// Meal schema definition
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

// Order schema definition
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
  orderId: {
    type: String,
    required: true,
  },
  orderType: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    default: 'Pending', 
    required: true, 
  },
  paymentStatus: {
    type: String,
    required: false, 
  },
  meals: [mealSchema],  
 
});

// Check if the model already exists
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
