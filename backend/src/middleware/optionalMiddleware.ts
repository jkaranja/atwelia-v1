import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { UserInToken } from "../types/user";

interface Decoded {
  user: UserInToken;
}

const optionalJWT: RequestHandler = (req, res, next) => {
  const authHeader =
    (req.headers.authorization as string) ||
    (req.headers.Authorization as string);

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }
  //const [token, type] = req.headers.authorization.split(" ") ?? []

  const token = authHeader.split(" ")[1];
  //token exists but has expired//return 401 so req can be retried
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return next();

    const { _id, roles, accountStatus } = (decoded as Decoded).user;
    //user has a valid token but do they exist in db
    const user = await User.findById(_id).select("-password").lean().exec();

    if (!user) {
      return next();
    }
    //add user to the req object
    req.user = user;

    next();
  });
};

export default optionalJWT;
