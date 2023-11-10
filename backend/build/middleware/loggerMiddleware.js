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
exports.logger = exports.logEvents = void 0;
const date_fns_1 = require("date-fns");
const fs_1 = __importStar(require("fs"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const allowedOrigins_1 = __importDefault(require("../config/allowedOrigins"));
//function for logging all requests and errors to our files
//custom logger//you can also use winston package for console(like morgan) + file logging
//https://www.npmjs.com/package/winston
const logEvents = async (message, logFileName) => {
    const dateTime = (0, date_fns_1.format)(new Date(), "yyyyMMdd\tHH:mm:ss");
    const logItem = `${dateTime}\t${(0, uuid_1.v4)()}\t${message}\n`;
    try {
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, "..", "logs"))) {
            await fs_1.promises.mkdir(path_1.default.join(__dirname, "..", "logs"));
        }
        await fs_1.promises.appendFile(path_1.default.join(__dirname, "..", "logs", logFileName), logItem);
    }
    catch (err) {
        console.log(err);
    }
};
exports.logEvents = logEvents;
/**logs all requests//put conditions to only log request coming from other origins//will get full fast */
const logger = (req, res, next) => {
    //    req.headers.origin//where req came from//if not browser eg postman, origin is undefined
    //    req.headers.host//where was sent to
    //.url = same as .path eg /login
    //change this when going to production//allow only if not your own origin
    //log req from postman(origin=undefined) or another site/(not from allowed origin)
    console.log("hello" + req.headers.origin);
    if (!req.headers.origin || !allowedOrigins_1.default.includes(req.headers.origin)) {
        logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
    }
    //   console.log(`${req.method} ${JSON.stringify(req.path)}`);
    next();
};
exports.logger = logger;
