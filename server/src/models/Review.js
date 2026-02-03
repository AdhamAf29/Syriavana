import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, default: "" },
  reviewDate: { type: Date, default: Date.now }
}, { timestamps: true });

reviewSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
