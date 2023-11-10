"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const uploader = ({ dest }) => {
    const multerStorage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            ////if not set/multer generates a random filename with no extension
            // file name can't contain:  ?*: /\"<>|
            //set file name by first checking if it exist
            fs_1.default.stat(`${dest}/${file.originalname}`, (err, stat) => {
                if (err == null) {
                    // The check succeeded//file exist//add date to rename
                    //    //below, replaces : with - ///g=global..apply to all matches not just the first match
                    const uploadedFileName = new Date().toISOString().replace(/[:.]/g, "-") +
                        "-" +
                        file.originalname;
                    //const uploadedFileName = Date.now() + '-' + file.originalname;
                    cb(null, uploadedFileName);
                }
                else if (err.code == "ENOENT") {
                    //if doesn't exist, keep orig name
                    cb(null, file.originalname);
                }
                else {
                    //terminate upload and forward error
                    cb(new Error(`Failed! Please forward this error to support: ${err.code}`), file.originalname //must pass this with Ts as cb expects 2 args//any string is okay//
                    );
                }
                //
            });
        },
    });
    return (0, multer_1.default)({
        storage: multerStorage,
    });
};
exports.default = uploader;
