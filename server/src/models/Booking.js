import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  numberOfPeople: { type: Number, required: true },
  companions: [mongoose.Schema.Types.Mixed], // Can be array of strings or objects
  paymentMethod: { type: String, default: "cash" },
  paymentStatus: { type: String, default: "pending" },
  bookingStatus: { type: String, default: "confirmed" }, // confirmed, cancelled
  bookingDate: { type: Date, default: Date.now },
  notes: { type: String, default: "" },
  busType: { type: String, default: "standard" }
}, { timestamps: true });

bookingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
