import { Schema, Types, model } from "mongoose";

interface IKopo {
  user: Types.ObjectId;  
  eventId: string;
  mpesaCode: string;
  type: string;
  phoneNumber: string;
  fname: string;
  lname: string;
  status: string;
  amount: number;
  initTime: Date;
  isChecked: boolean;
}

const kopoSchema = new Schema<IKopo>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    eventId: { type: String },
    mpesaCode: { type: String },
    type: { type: String },
    phoneNumber: { type: String },
    status: { type: String },
    amount: { type: Number, default: 0 },
    initTime: { type: Date },
  },
  { timestamps: true }
);

export default model<IKopo>("Kopo", kopoSchema);
