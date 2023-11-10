import { Schema, Types, model } from "mongoose";
import { ILocation } from "../types/listing";

export enum CommissionStatus {
  Pending = "Pending",
  Paid = "Paid",
}

interface ICommission {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  renter: Types.ObjectId;
  amount: number;
  listing: Types.ObjectId;
  status: CommissionStatus;
}
const commissionSchema = new Schema<ICommission>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    renter: { type: Schema.Types.ObjectId, ref: "User" },
    tour: { type: Schema.Types.ObjectId, ref: "Tour" },
    amount: { type: Number, default: 0 },
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
    status: {
      type: String,
      enum: CommissionStatus,
      default: CommissionStatus.Pending,
    },
  },
  { timestamps: true }
);
export default model<ICommission>("Commission", commissionSchema);
