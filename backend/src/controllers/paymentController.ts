import { RequestHandler } from "express";
import Activity, { ActivityType } from "../models/Activity";
import Commission, { CommissionStatus } from "../models/Commission";
import Kopo from "../models/Kopo";
import User from "../models/User";

//Having stored your credentials as environment variables
const options = {
  clientId: process.env.K2_CLIENT_ID,
  clientSecret: process.env.K2_CLIENT_SECRET,
  baseUrl: process.env.K2_BASE_URL,
  apiKey: process.env.K2_API_KEY,
};

//Including the kopokopo module
const K2 = require("k2-connect-node")(options);

//gen token function
const genK2Token = async () => {
  const TokenService = K2.TokenService;
  const { access_token } = await TokenService.getToken(); //access_token in object
  return access_token;
};

interface SearchQuery {
  page: string;
  size: string;
}

/**
 * @desc - Get payments info:
 * @route - GET api/payments/commissions
 * @access - Private
 */
export const getCommissions: RequestHandler<
  unknown,
  unknown,
  unknown,
  SearchQuery
> = async (req, res) => {
  const { _id } = req.user!;
  /**----------------------------------
         * PAGINATION
  ------------------------------------*/
  //query string payload
  const page = parseInt(req.query.page) || 1; //current page no. / sent as string convert to number//page not sent use 1
  const size = parseInt(req.query.size) || 10; //items per page//if not sent from FE/ use default 15
  const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items

  //filter
  const filter = {
    user: _id,
    status: CommissionStatus.Pending,
  };

  //const total = await Commission.find(filter).count(); //or Order.countDocument() ///total docs

  const commissions = await Commission.find(filter).lean().exec();

  const total = commissions.length;
  //if total = 0 //error
  if (!total) {
    return res.status(400).json({ message: "No record found" });
  }

  const pages = Math.ceil(total / size);

  //in case invalid page is sent//out of range//not from the pages sent
  if (page > pages) {
    return res.status(400).json({ message: "Page not found" });
  }

  const result = await Commission.find(filter)
    .skip(skip)
    .limit(size)
    .populate("user", "_id username phoneNumber")
    .populate({
      path: "renter",
      select: "_id profile username phoneNumber",
      populate: { path: "profile", select: "_id profilePic" },
    })
    .populate("listing", "_id bedrooms location")
    .sort({ updatedAt: -1 }) //desc//recent first
    .lean(); //return a pure js object//not mongoose document//don't convert result to mongoose document//about 5x smaller!//faster

  res.json({
    pages,
    total,
    commissions: result,
    balance: commissions.reduce((acc, current) => {
      return acc + current.amount;
    }, 0),
  });
};

/**
 * @desc - Get payments info:
 * @route - GET api/payments/activities
 * @access - Private
 */
export const getActivities: RequestHandler<
  unknown,
  unknown,
  unknown,
  SearchQuery
> = async (req, res) => {
  const { _id } = req.user!;

  /**----------------------------------
         * PAGINATION
  ------------------------------------*/
  //query string payload
  const page = parseInt(req.query.page) || 1; //current page no. / sent as string convert to number//page not sent use 1
  const size = parseInt(req.query.size) || 10; //items per page//if not sent from FE/ use default 15
  const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items

  //filter
  const filter = {
    user: _id,
  };

  const total = await Activity.find(filter).count(); //or Order.countDocument() ///total docs
  //if total = 0 //error
  if (!total) {
    return res.status(400).json({ message: "No record found" });
  }

  const pages = Math.ceil(total / size);

  //in case invalid page is sent//out of range//not from the pages sent
  if (page > pages) {
    return res.status(400).json({ message: "Page not found" });
  }

  const result = await Activity.find(filter)
    .skip(skip)
    .limit(size)
    .sort({ updatedAt: -1 }) //desc//recent first
    .lean(); //return a pure js object//not mongoose document//don't convert result to mongoose document//about 5x smaller!//faster

  res.json({
    pages,
    total,
    activities: result,
  });
};

/**
 * @desc - Deposit to payments via stk push:
 * @route - POST api/payments/deposit
 * @access - Private
 */
/*--------------------------
SRK PUSH/
----------------------------*/
export const deposit: RequestHandler = async (req, res) => {
  const { _id, phoneNumber } = req.user!;

  const { amount } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: `Phone number is required` });
  }

  //get k2 token
  const accessToken = await genK2Token();

  if (!accessToken) {
    return res
      .status(400)
      .json({ message: `Transaction couldn't be completed. Please try again` });
  }

  const StkService = K2.StkService;

  const stkOptions = {
    paymentChannel: "M-PESA STK Push",
    tillNumber: "K802272",
    firstName: phoneNumber, //see in kopo a/c//not shown
    lastName: "",
    phoneNumber,
    amount,
    // email: 'example@example.com',//optional
    currency: "KES",
    // A maximum of 5 key value pairs
    metadata: {
      customerId: _id,
      reference: _id,
      notes: "Payment for unpaid commissions",
    },
    // This is where once the request is completed kopokopo will post the response
    callbackUrl: `${process.env.BASE_URL}/api/payments/deposit/callback`,
    accessToken,
  };

  const locationURL = await StkService.initiateIncomingPayment(stkOptions);
  //if undefined//err
  if (!locationURL) {
    return res.status(400).json({
      message: `Transaction couldn't be completed. Please try again`,
    });
  }
  //status will be 'Pending' with getStatus
  res.json({
    message: "Transaction initiated. A prompt was sent to your phone",
  });
};

/**
 * @desc - Deposit to payments via stk push callback:
 * @route - POST api/payments/deposit/callback
 * @access - Public*MUST BE PUBLIC
 */
export const depositCallback: RequestHandler = async (req, res) => {
  const Webhooks = K2.Webhooks;
  const payload = await Webhooks.webhookHandler(req, res);

  //if transaction is not 'Success' but instead 'Failed'-->exit
  if (payload.data.attributes.status !== "Success") return;
  //console.error(`Failed: ${payload.data.attributes.event.errors}`);

  const user = payload.data.attributes.metadata.customerId;
  const amount = Number(payload.data.attributes.event.resource.amount);
  const mpesaCode = payload.data.attributes.event.resource.reference;

  //catch duplicate
  const duplicate = await Kopo.findOne({ mpesaCode })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) return;

  //insert record into activity
  await Activity.create({
    user,
    activityType: ActivityType.Deposit,
    amount,
  });

  //update status for unpaid commissions
  await Commission.updateMany(
    { user, status: CommissionStatus.Pending },
    {
      $set: { status: CommissionStatus.Paid },
    }
  );

  //insert record into Kopo
  await Kopo.create({
    user,
    eventId: payload.data.id,
    mpesaCode,
    type: payload.data.type,
    phoneNumber: payload.data.attributes.event.resource.sender_phone_number,
    status: payload.data.attributes.event.resource.status,
    amount,
    initTime: payload.data.attributes.initiation_time,
  });

  res.status(200).json({ message: "Deposited" });
};

/*--------------------------------------------
WEBHOOKS -> FALLBACK ALTERNATIVE TO STK PUSH
----------------------------------------------*/
/**
 * @desc - Register webhook webhook subscription, only needs to be run once->see webhooks subscriptions on k2 account->app
 * @route - POST api/payments/webhook/subscribe
 * @access - Private
 */
export const subscribeToWebhook: RequestHandler = async (req, res) => {
  const accessToken = await genK2Token();
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const Webhooks = K2.Webhooks;
  const subscribeOptions = {
    eventType: "buygoods_transaction_received",
    url: `${process.env.BASE_URL}/api/payments/webhook/callback`, //endpoint(must be https) where webhook payload is posted
    scope: "till",
    scopeReference: "5139511", // Your till number
    accessToken,
  };

  const url = await Webhooks.subscribe(subscribeOptions); //returns url you can use to query record
  //subscribed: "url": see .env
  res.json({ url });
};

/**
 * @desc - register webhook webhook subscription
 * @route - POST api/payments/webhook/callback
 * @access - Public*MUST BE PUBLIC
 */
export const processWebhook: RequestHandler = async (req, res) => {
  const Webhooks = K2.Webhooks;
  const payload = await Webhooks.webhookHandler(req, res);

  //status must be "Received",
  if (payload.event.resource.status !== "Received") return;

  const amount = parseInt(payload.event.resource.amount);
  const mpesaCode = payload.event.resource.reference;
  const phoneNumber = payload.event.resource.sender_phone_number;
  //catch duplicate
  const duplicate = await Kopo.findOne({ mpesaCode })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    console.error(`Error: Transaction already processed`);
    return;
  }

  //get user by phone number
  const user = await User.findOne({ phoneNumber }).lean().exec();
  if (!user) return; //exit if user not found with that phone number

  //insert record into activity
  await Activity.create({
    user: user._id,
    activityType: ActivityType.Deposit,
    amount,
  });

  //update status for unpaid commissions
  await Commission.updateMany(
    { user: user._id, status: CommissionStatus.Pending },
    {
      $set: { status: CommissionStatus.Paid },
    }
  );

  //insert record into Kopo
  await Kopo.create({
    user: user._id,
    eventId: payload.id,
    mpesaCode,
    type: payload.event.type,
    phoneNumber,
    status: payload.event.resource.status,
    amount,
    initTime: payload.event.resource.origination_time,
  });

  res.status(200).json({ message: "Deposited" });
};
