import { Schema, Types, model } from "mongoose";
import { MessageStatus } from "../types/chat";

interface IMessage {
  sender: Types.ObjectId;
  chat: Types.ObjectId;
  content: string;
  files: [];
  isRead: boolean;
  messageStatus: MessageStatus;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    content: { type: String },
    files: { type: [] },
    isRead: { type: Boolean, default: false },
    messageStatus: {
      type: String,
      enum: MessageStatus,
      default: MessageStatus.Available,
    },
  },
  { timestamps: true }
);

export default model<IMessage>("Message", messageSchema);
