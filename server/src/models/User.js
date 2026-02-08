import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin", "company"], default: "user" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Site" }],
  companyProfile: {
    description: { type: String, default: "" },
    logo: { type: String, default: "" },
    contactInfo: { type: String, default: "" }
  }
}, { timestamps: true });

// Transform _id to id
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const User = mongoose.model("User", userSchema);
export default User;
