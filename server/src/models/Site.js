import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAr: { type: String },
  type: { type: String },
  typeAr: { type: String },
  description: { type: String },
  descriptionAr: { type: String },
  detailsAr: { type: String },
  builtAr: { type: String },
  province: { type: String },
  provinceAr: { type: String },
  ratingAverage: { type: Number, default: 0 },
  images: [String],
  location: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

siteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const Site = mongoose.model("Site", siteSchema);
export default Site;
