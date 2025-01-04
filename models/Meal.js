import mongoose from 'mongoose';

// Meal schema
const mealSchema = new mongoose.Schema(
  {
    mealName: { type: String, required: true },
    mealType: { type: String, required: true }, 
    mealPrice: { type: String, required: true }, 
    mealDescription: { type: String, required: true }, 
    mealQuantity: { type: String, required: true }, 
    image: { type: String, required: true },
    mealstatus: { type: String, default: 'Active' },
    selectCanteen: { type: String, required: true },
  },
  { timestamps: true }
);

const Meal = mongoose.models.Meal || mongoose.model('Meal', mealSchema);

export default Meal;
