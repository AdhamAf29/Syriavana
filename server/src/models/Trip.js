import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  duration: { type: String },
  atmosphere: { type: String },
  itinerary: [{
    icon: String,
    title: String,
    description: String
  }],
  startDate: { type: Date },
  endDate: { type: Date },
  price: { type: Number },
  totalSeats: { type: Number },
  seatsAvailable: { type: Number },
  departurePoint: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
  sites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Site" }],
  images: [String],
  rating: { type: Number, default: 0 },
  discount: {
    amount: { type: Number, default: 0 },
    active: { type: Boolean, default: false }
  },
  active: { type: Boolean, default: true }
}, { timestamps: true });

tripSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
