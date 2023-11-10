import { IImage } from "./file";
import { IUser } from "./user";

// Define a type for the slice state
export interface Coordinate {
  //angles measured from center of the sphere(horizontally for longitudes and vertically for latitudes)
  latitude: number; //(distance from equator -90south pole<=0=>90 north pole)angle that ranges from –90° at the south pole to 90° at the north pole, with 0° at the Equator(covers 180 degrees).
  longitude: number; //(distance from prime meridian -180west<=0=>180east) in degrees from 0° at the Prime Meridian to +180° eastward and −180° westward(covers 360 degrees)
  latitudeDelta: number; //height/used for zooming in on the map
  longitudeDelta: number; ///width/used for zooming in on the map
}

export enum ListedBy {
  Broker = "Broker",
  Landlord = "Landlord",
  Agent = "Agent",
}

export enum ListingStatus {
  Draft = "Draft",
  Available = "Available",
  Unavailable = "Unavailable",
}

export interface ILocation {
  description: string;
  coordinate: Coordinate;
}


export interface IAmenities {
  parking: boolean;
  wifi: boolean;
  gym: boolean;
  pool: boolean;
  watchman: boolean;
  cctv: boolean;
  securityLights: boolean;
  water: boolean;
  borehole: boolean;
}

export interface IListing {
  _id: string;
  user: IUser;  
  updatedAt: string;
  location: ILocation;
  //listedBy: ListedBy | string;
  bedrooms: string;
  bathrooms: string;
  //kitchen: string;
  price: number | string;
  //policies: Array<string>;
  // management: string;
  //tourFee: number;
  overview: string;
  //keywords: Array<string>;
  listingStatus: string;
  listingImages: IImage[];
  featuredImage: IImage;
  amenities: IAmenities;
}

export interface IListingResult {
  pages: number;
  listings: IListing[];
  total: number;
}

export interface IListingFilter {
  page: number;
  itemsPerPage: number;
  filters?: Partial<IListing> & { priceRange?: number[] };
}
