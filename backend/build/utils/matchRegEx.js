"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matchRegEx = (value) => {
    return {
        $regex: `.*${value || ""}.*`,
        $options: "i",
    };
};
exports.default = matchRegEx;
