"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteFiles = (files) => {
    //catch any file system errors
    try {
        if (!files?.length)
            return null;
        files.forEach((file) => {
            const fullFilePath = path_1.default.resolve(__dirname, "../", "../", file.path);
            fs_1.default.unlinkSync(fullFilePath);
        });
        return "deleted";
    }
    catch (e) {
        return null;
    }
};
exports.default = deleteFiles;
