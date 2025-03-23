import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    faculty: { type: String, required: true },  
    phoneNumber: { type: String, required: true }, 
    nicNumber: { type: String, required: true },
    status: { type: String, default: 'active' },  
   
  },
  { timestamps: true } 
);

export default mongoose.models.User || mongoose.model('User', userSchema);
