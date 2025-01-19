import mongoose from "mongoose";

const ownerDetailsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true},
    image: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    nicNumber: { type: String, required: true },
    status: { type: String, default: "Active" },
    selectcanteen: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const OwnerDetails =
  mongoose.models.OwnerDetails ||
  mongoose.model("OwnerDetails", ownerDetailsSchema);

export default OwnerDetails;
