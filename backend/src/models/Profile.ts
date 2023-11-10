import { Schema, Types, model, models } from "mongoose";
import { IProfile } from "../types/user";

const profileSchema = new Schema<IProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    profilePic: { type: Object }, //or {}, Schema.Types.Mixed, mongoose.Mixed, = { url: string; publicId: string }
    //location: Number,
    //reviews
    bio: String,
    tourFee: Number,
    phoneNumbers: [String],
  },
  { timestamps: true }
);

export default model<IProfile>("Profile", profileSchema);
