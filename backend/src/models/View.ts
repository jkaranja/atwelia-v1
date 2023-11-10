import { Schema, Types, model, models } from "mongoose";

interface IView {
  listing: Types.ObjectId;
  user: Types.ObjectId;
  count: number;
}

const viewSchema = new Schema<IView>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
    count: Number,
  },
  { timestamps: true }
);

export default model<IView>("View", viewSchema);
