import { Schema, Types, model, models } from "mongoose";

interface IFavorite {
  listing: Types.ObjectId;
  user: Types.ObjectId;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId,  ref: "User" },
    listing: { type: Schema.Types.ObjectId, ref: "Listing" },
  },
  { timestamps: true }
);

export default model<IFavorite>("Favorite", favoriteSchema);
