"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        mongoose_1.default.set("strictQuery", false);
        // ! tell TS variable won't be undefined since var= string | undefined//remove that check
        //not needed//see module argumentation env.d.ts
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI);
        // console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
exports.default = connectDB;
