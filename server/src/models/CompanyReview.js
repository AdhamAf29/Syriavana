import mongoose from "mongoose";

const companyReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, default: "" },
  reviewDate: { type: Date, default: Date.now }
}, { timestamps: true });

companyReviewSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

const CompanyReview = mongoose.model("CompanyReview", companyReviewSchema);
export default CompanyReview;
