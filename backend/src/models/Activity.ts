import { Schema, Types, model } from "mongoose";

export enum ActivityType {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
}

interface IActivity {
  user: Types.ObjectId;
  amount: number;
  activityType: ActivityType;
  updateAt: string;
}
const activitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, default: 0 },
    activityType: { type: String, enum: ActivityType },
  },
  { timestamps: true }
);
export default model<IActivity>("Activity", activitySchema);
