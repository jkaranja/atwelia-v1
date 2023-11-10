import { model, Schema } from "mongoose";
import { IListing, ListingStatus } from "../types/listing";

//schema definition//properties must be defined in document interface above//vice versa is not true
const listingSchema = new Schema<IListing>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    listingImages: {
      type: [
        {
          path: String,
          filename: String,
          mimetype: String,
          size: Number,
          destination: String,
        },
      ],
    },
    featuredImage: {
      type: {
        path: String,
        filename: String,
        mimetype: String,
        size: Number,
        destination: String,
      },
    },
    location: {
      type: {
        coordinate: {
          latitude: Number,
          latitudeDelta: Number,
          longitudeDelta: Number,
        },
        description: String,
      },
    },
    bedrooms: { type: String },
    bathrooms: { type: String },
    price: { type: Number },
    amenities: {
      type: {
        water: Boolean,
        parking: Boolean,
        wifi: Boolean,
        gym: Boolean,
        pool: Boolean,
        borehole: Boolean,
        watchman: Boolean,
        cctv: Boolean,
        securityLights: Boolean,
      },
    },
    overview: String,
    listingStatus: { type: String, enum: ListingStatus },
  },
  {
    timestamps: true,
  }
);

//you can do automatic type inference//do not account for noteId//only what is defined in schema//+ other issues with timestamps/not good
// type Note = InferSchemaType<typeof noteSchema>;
// export default mongoose.model<Note>("Note", noteSchema);

export default model<IListing>("Listing", listingSchema);
