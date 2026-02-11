import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  numberOfPeople: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  busType: { type: String },
  notes: { type: String },
  companions: [{ type: String }],
  status: { type: String, default: 'pending' }
}, { timestamps: true });

bookingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

bookingSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model("Booking", bookingSchema);
