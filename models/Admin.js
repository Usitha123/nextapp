// models/Admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minLength: [2, 'First name must be at least 2 characters'],
    maxLength: [50, 'First name must be less than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minLength: [2, 'Last name must be at least 2 characters'],
    maxLength: [50, 'Last name must be less than 50 characters']
  },
  phone: { 
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+?[\d\s-()]{10,}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  nic: {
    type: String,
    required: [true, 'NIC is required'],
    unique: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        // Basic NIC validation - adjust according to your country's format
        return /^[0-9]{9}[VX]$|^[0-9]{12}$/.test(v);
      },
      message: 'Please enter a valid NIC number'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: "Active"
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

// Indexes for better query performance
AdminSchema.index({ email: 1 });
AdminSchema.index({ nic: 1 });
AdminSchema.index({ status: 1 });

// Pre-save hook to hash the password before saving
AdminSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12); // Higher salt rounds for better security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare passwords
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find admin by email
AdminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Virtual for full name
AdminSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
AdminSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password; // Never return password in JSON
    return ret;
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export default Admin;