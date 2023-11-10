import { RequestHandler } from "express";

import Commission from "../models/Commission";

/**
 * @desc - Payment guard -> if commissions unpaid balance >= 2000, decline req
 * @route - Tours + Listings
 * @access - Private
 */
const paymentGuard: RequestHandler = async (req, res, next) => {
  const { _id } = req.user!;

  const commissions = await Commission.find({ user: _id }).lean().exec();

  const balance = commissions.reduce((acc, current) => {
    return acc + current.amount;
  }, 0);

  if (balance >= 2000) {
    return res
      .status(403)
      .json({ message: "Forbidden. Please  clear outstanding balance" });
  }

  next(); 
};

export default paymentGuard;
