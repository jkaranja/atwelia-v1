import { Schema, Types, model } from "mongoose";

interface IWallet {
  user: Types.ObjectId;
  balance: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number, default: 0 },
    expiresAt: { type: Date, default: Date.now() + 1 * 8.64e7 },//expires in 24hrs
  },
  { timestamps: true }
);

export default model<IWallet>("Wallet", walletSchema);
