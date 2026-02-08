import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  contactInfo: { type: String, default: "" },
  logo: { type: String, default: "" },
  status: { 
    type: String, 
    enum: ["pending", "active", "suspended"], 
    default: "active" 
  }
}, { timestamps: true });

companySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const Company = mongoose.model("Company", companySchema);
export default Company;
