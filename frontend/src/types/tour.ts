import { IListing } from "./listing";
import { IUser } from "./user";

export enum TourStatus {
  Upcoming = "Upcoming",
  Unconfirmed = "Unconfirmed",
  Rescheduled = "Rescheduled",
  Cancelled = "Cancelled",
  Declined = "Declined",
  Completed = "Completed",
}

export interface ITour {
  _id: string;
  agent: IUser;
  renter: IUser;
  listing: IListing;
  tourDates: Array<Date>;
  tourDate: Date;
  tourStatus: TourStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ITourResult {
  pages: number;
  tours: ITour[];
  total: number;
}

export interface ITourFilter {
  page: number;
  itemsPerPage: number;
  filters?: { status: string };
}
