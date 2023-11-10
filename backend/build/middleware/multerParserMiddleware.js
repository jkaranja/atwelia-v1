"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
//multer supports two types of storages: in-memory and disk
//if {storage: or dest: '/'} is not passed to  multer, it stores the file in-memory(temporary/RAM), & also parses data and creates a buffer. It returns req.file/s & req.body as usual
//the buffer rep the file in memory and can be saved by first converting it into a readable stream using eg streamifier package
const parseUpload = (0, multer_1.default)();
exports.default = parseUpload;
//req.file object shape if in-memory storage:
//  {
// fieldname: 'profilePic',
// originalname: 'healthy-dental-concept.jpg',
// encoding: '7bit',
// mimetype: 'image/jpeg',
// buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 01 2c 01 2c 00 00 ff ed 05 7e 50 68 6f 74 6f 73 68 6f 70 20 33 2e 30 00 38 42 49 4d 04 04 00 00 00 00 05 42 ... 348965 mo0 00 00 05 42 ... 348965 more bytes>,
// size: 349015
// }
//normal disk storage returned file shape:
//returns:
// {
//     fieldname: 'myFile',
//     originalname: 'IMG-20220427-WA0003.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     destination: 'public/upload',
//     filename: '0c226dea6ed5fd6d6f58644bb5ef4243',//could be modified to avoid duplicate
//     path: 'public\\upload\\0c226dea6ed5fd6d6f58644bb5ef4243',
//     size: 111097
//   }
