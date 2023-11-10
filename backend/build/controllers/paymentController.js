"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWebhook = exports.subscribeToWebhook = exports.depositCallback = exports.deposit = exports.getActivities = exports.getCommissions = void 0;
const Activity_1 = __importStar(require("../models/Activity"));
const Commission_1 = __importStar(require("../models/Commission"));
const Kopo_1 = __importDefault(require("../models/Kopo"));
const User_1 = __importDefault(require("../models/User"));
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
/**
 * @desc - Get payments info:
 * @route - GET api/payments/commissions
 * @access - Private
 */
const getCommissions = async (req, res) => {
    const { _id } = req.user;
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
        status: Commission_1.CommissionStatus.Pending,
    };
    //const total = await Commission.find(filter).count(); //or Order.countDocument() ///total docs
    const commissions = await Commission_1.default.find(filter).lean().exec();
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
    const result = await Commission_1.default.find(filter)
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
exports.getCommissions = getCommissions;
/**
 * @desc - Get payments info:
 * @route - GET api/payments/activities
 * @access - Private
 */
const getActivities = async (req, res) => {
    const { _id } = req.user;
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
    const total = await Activity_1.default.find(filter).count(); //or Order.countDocument() ///total docs
    //if total = 0 //error
    if (!total) {
        return res.status(400).json({ message: "No record found" });
    }
    const pages = Math.ceil(total / size);
    //in case invalid page is sent//out of range//not from the pages sent
    if (page > pages) {
        return res.status(400).json({ message: "Page not found" });
    }
    const result = await Activity_1.default.find(filter)
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
exports.getActivities = getActivities;
/**
 * @desc - Deposit to payments via stk push:
 * @route - POST api/payments/deposit
 * @access - Private
 */
/*--------------------------
SRK PUSH/
----------------------------*/
const deposit = async (req, res) => {
    const { _id, phoneNumber } = req.user;
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
        firstName: phoneNumber,
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
exports.deposit = deposit;
/**
 * @desc - Deposit to payments via stk push callback:
 * @route - POST api/payments/deposit/callback
 * @access - Public*MUST BE PUBLIC
 */
const depositCallback = async (req, res) => {
    const Webhooks = K2.Webhooks;
    const payload = await Webhooks.webhookHandler(req, res);
    //if transaction is not 'Success' but instead 'Failed'-->exit
    if (payload.data.attributes.status !== "Success")
        return;
    //console.error(`Failed: ${payload.data.attributes.event.errors}`);
    const user = payload.data.attributes.metadata.customerId;
    const amount = Number(payload.data.attributes.event.resource.amount);
    const mpesaCode = payload.data.attributes.event.resource.reference;
    //catch duplicate
    const duplicate = await Kopo_1.default.findOne({ mpesaCode })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    if (duplicate)
        return;
    //insert record into activity
    await Activity_1.default.create({
        user,
        activityType: Activity_1.ActivityType.Deposit,
        amount,
    });
    //update status for unpaid commissions
    await Commission_1.default.updateMany({ user, status: Commission_1.CommissionStatus.Pending }, {
        $set: { status: Commission_1.CommissionStatus.Paid },
    });
    //insert record into Kopo
    await Kopo_1.default.create({
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
exports.depositCallback = depositCallback;
/*--------------------------------------------
WEBHOOKS -> FALLBACK ALTERNATIVE TO STK PUSH
----------------------------------------------*/
/**
 * @desc - Register webhook webhook subscription, only needs to be run once->see webhooks subscriptions on k2 account->app
 * @route - POST api/payments/webhook/subscribe
 * @access - Private
 */
const subscribeToWebhook = async (req, res) => {
    const accessToken = await genK2Token();
    if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const Webhooks = K2.Webhooks;
    const subscribeOptions = {
        eventType: "buygoods_transaction_received",
        url: `${process.env.BASE_URL}/api/payments/webhook/callback`,
        scope: "till",
        scopeReference: "5139511",
        accessToken,
    };
    const url = await Webhooks.subscribe(subscribeOptions); //returns url you can use to query record
    //subscribed: "url": see .env
    res.json({ url });
};
exports.subscribeToWebhook = subscribeToWebhook;
/**
 * @desc - register webhook webhook subscription
 * @route - POST api/payments/webhook/callback
 * @access - Public*MUST BE PUBLIC
 */
const processWebhook = async (req, res) => {
    const Webhooks = K2.Webhooks;
    const payload = await Webhooks.webhookHandler(req, res);
    //status must be "Received",
    if (payload.event.resource.status !== "Received")
        return;
    const amount = parseInt(payload.event.resource.amount);
    const mpesaCode = payload.event.resource.reference;
    const phoneNumber = payload.event.resource.sender_phone_number;
    //catch duplicate
    const duplicate = await Kopo_1.default.findOne({ mpesaCode })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    if (duplicate) {
        console.error(`Error: Transaction already processed`);
        return;
    }
    //get user by phone number
    const user = await User_1.default.findOne({ phoneNumber }).lean().exec();
    if (!user)
        return; //exit if user not found with that phone number
    //insert record into activity
    await Activity_1.default.create({
        user: user._id,
        activityType: Activity_1.ActivityType.Deposit,
        amount,
    });
    //update status for unpaid commissions
    await Commission_1.default.updateMany({ user: user._id, status: Commission_1.CommissionStatus.Pending }, {
        $set: { status: Commission_1.CommissionStatus.Paid },
    });
    //insert record into Kopo
    await Kopo_1.default.create({
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
exports.processWebhook = processWebhook;
