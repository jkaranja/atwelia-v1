// import { addDays } from "date-fns";
// import { RequestHandler } from "express";
// import Activity from "../models/Activity";
// import Billing, { SubType } from "../models/Billing";
// import Wallet from "../models/Wallet";
// import { ActivityType } from "../types/wallet";

// /**
//  * @desc - Get billing info:
//  * @route - GET api/billing
//  * @access - Private
//  */
// export const getBillingInfo: RequestHandler = async (req, res, next) => {
//   const { _id } = req.user!;

//   const billing = await Billing.findOne({
//     clientId: _id,
//   }).exec();
//    //unlikely->billing record created when user registers
//   if (!billing) {
//     return res.status(400).json({ message: "No record found" });
//   }

//   res.json(billing);
// };

// /**
//  * @desc - Renew subscription:
//  * @route - PATCH api/billing
//  * @access - Private
//  */
// export const renewSubscription: RequestHandler = async (req, res) => {
//   const { _id } = req.user!;

//   const { plan } = req.body;

//   if (!plan) {
//     return res.status(400).json({ message: "Plan is required" });
//   }
//   //check balance in wallet
//   const walletBal = await Wallet.findOne({ clientId: _id }).exec();
//   //client wallet record not created yet, created on first deposit->else walletBal = null
//   if (!walletBal) {
//     return res.status(400).json({ message: "Not enough funds in wallet" });
//   }
//   //client wallet record exists but not enough money
//   if (walletBal.balance < plan?.amount) {
//     return res.status(400).json({ message: "Not enough funds in wallet" });
//   }

//   //get billing
//   const billing = await Billing.findOne({
//     clientId: _id,
//   }).exec();

//   if (!billing) {
//     return res.status(400).json({message: "No record found"});
//   }

//   //update expiresAt-->if already expired, start from today else add diff + duration
//   const diff = new Date(billing.expiresAt).getTime() - Date.now();
//   const newExpiry =
//     diff > 0
//       ? addDays(new Date(billing.expiresAt), plan.duration)
//       : addDays(new Date(), plan.duration);

//   billing.expiresAt = newExpiry;

//   billing.subType = SubType.Paid;
//   //save changes
//   await billing.save();

//   //deduct amount from wallet
//   walletBal.balance = walletBal.balance - plan.amount;
//   //save changes
//   const updatedBal = await walletBal.save();

//   //insert record into activity
//   await Activity.create({
//     clientId: _id,
//     activityType: ActivityType.AccountSub,
//     amount: plan?.amount,
//     newBalance: updatedBal?.balance, //new bal
//   });

//   res.json({ message: "Subscription renewed" });
// };
