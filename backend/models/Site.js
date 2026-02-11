import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  location: { type: String }
}, { timestamps: true });

siteSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

siteSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model("Site", siteSchema);
