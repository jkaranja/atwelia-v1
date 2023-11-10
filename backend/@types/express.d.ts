export {};
import mongoose from "mongoose";
import { AccountStatus, IUser, Role } from "../src/types/user";
//adds type for user prop in the express request object

declare global {
  namespace Express {
    //passport has already added user prop to req object but given user an empty interface of User
    //use the same interface name and TS will merge the two since they are in the same express namespace/scope
    // interface User extends IUser {}
    //when not using passport, add user  to request object
    interface Request {
      user: IUser;
    }
  }
}
