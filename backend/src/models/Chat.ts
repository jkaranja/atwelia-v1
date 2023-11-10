import { Schema, Types, model } from "mongoose";

interface IChat {
  participants: Types.ObjectId[];
  admin: Types.ObjectId;
  latestMessage: Types.ObjectId;
}

const chatSchema = new Schema<IChat>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    admin: { type: Schema.Types.ObjectId, ref: "User" },
    latestMessage: {type: Schema.Types.ObjectId, ref: "Message",},
  },
  { timestamps: true }
);

export default model<IChat>("Chat", chatSchema);
