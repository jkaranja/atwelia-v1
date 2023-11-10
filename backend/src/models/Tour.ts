import { Schema, Types, model, models } from "mongoose";
import { TourStatus } from "../types/tour";
import { IUser } from "../types/user";
import { IListing } from "../types/listing";

interface ITour {
  renter: Types.ObjectId;
  agent: Types.ObjectId;
  listing: Types.ObjectId | IListing;
  cancelledBy: Types.ObjectId;
  tourDates: Date[];
  tourDate: Date;
  tourStatus: TourStatus;
  comment: string;
}

const tourSchema = new Schema<ITour>(
  {
    renter: { type: Schema.Types.ObjectId, ref: "User" }, //renter
    agent: { type: Schema.Types.ObjectId, ref: "User" }, //agent
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
    tourDates: { type: [Date] },
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    comment: String,
    tourDate: Date,
    tourStatus: {
      type: String,
      enum: TourStatus,
      default: TourStatus.Unconfirmed,
    },
  },
  { timestamps: true }
);

export default model<ITour>("Tour", tourSchema);
