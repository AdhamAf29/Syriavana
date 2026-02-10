import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin', 'company'] },
  companyProfile: {
    description: String,
    contactInfo: String,
    logo: String
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
