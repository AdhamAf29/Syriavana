import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Company/Admin who created it
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalSeats: { type: Number, required: true, default: 50 },
  seatsAvailable: { type: Number, required: true, default: 50 },
  sites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }]
}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);
