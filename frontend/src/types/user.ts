export enum Role {
  Renter = "Renter",
  Agent = "Agent",
}

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  profile: { _id: string; tourFee: number; profilePic: { filename: string } };
}

export enum AccountStatus {
  Pending = "Pending",
  Suspended = "Suspended",
  Approved = "Approved",
}

export interface IReview {
  _id: string;
  comment: string;
  user: IUser;
  postedBy: IUser;
  rating: number;
  createdAt: string;
}

export interface IProfile {
  _id: string;
  createAt: string;
  updatedAt: string;
  bio: string;
  tourFee: number;
  rating: number;
  reviews: IReview[];
  user: IUser;
  reviewCount: number;
  profilePic: { filename: string };
  phoneNumbers: string[];
}
