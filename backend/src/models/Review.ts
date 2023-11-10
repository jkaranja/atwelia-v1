import { Schema, Types, model, models } from "mongoose";
import { IUser } from "../types/user";

interface IReview {
  comment: string;
  user: Types.ObjectId;
  postedBy: Types.ObjectId;
  rating: number;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    comment: String,
    rating: Number,
  },
  { timestamps: true }
);

export default model<IReview>("Review", reviewSchema);
