import { Types } from "mongoose";
//you can use naming convention Client = "CLIENT",//bt don't look good

export interface UserInToken {
  _id: Types.ObjectId;
  roles: Role[];
  accountStatus: AccountStatus;
}

export enum Role {
  Renter = "Renter",
  Agent = "Agent",
  Buyer = "Buyer",
  Guest = "Guest",
  Subscriber = "Subscriber",
  Admin = "Admin",
}

export enum AccountStatus {
  Pending = "Pending",
  Suspended = "Suspended",
  Approved = "Approved",
  Dormant = "Dormant",
  Active = "Active", //Inactive
  Banned = "Banned",
}

export interface IProfilePic {
  path: string;
  filename: string;
  mimetype: string;
  size: number;
  destination?: string;
}

export interface IProfile {
  bio: string;
  profilePic: IProfilePic;
  user: Types.ObjectId;
  tourFee: number;
  phoneNumbers: string[];
}

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  profile: Types.ObjectId;
  password: string;
  //otp: string | null;
  //otpExpiresAt: Date | null;
  phoneNumber: string;
  roles: Role[];
  accountStatus: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
  //not used
  //newEmail: string | null;
  //isVerified: boolean;
  //verifyEmailToken: string | null;
  //setPasswordToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordTokenExpiresAt: number | null;
}
