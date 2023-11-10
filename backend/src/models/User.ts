import { model, Schema, Types } from "mongoose";
import { AccountStatus, IUser, Role } from "../types/user";

const userSchema = new Schema<IUser>(
  {
    email: { type: String },
    password: { type: String },
    username: { type: String },
    profile: { type: Schema.Types.ObjectId, ref: "Profile" },
    phoneNumber: { type: String },
    roles: { type: [String], enum: Role, default: [Role.Renter] },
    accountStatus: {
      type: String,
      enum: AccountStatus,
      default: AccountStatus.Approved,
    },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiresAt: { type: Number },
    // otp: { type: String },
    // otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

//type User = InferSchemaType<typeof userSchema>;
export default model<IUser>("User", userSchema);
