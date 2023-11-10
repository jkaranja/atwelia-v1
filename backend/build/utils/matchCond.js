"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matchCond = (value) => {
    return !!value || { $in: [false, true] };
};
exports.default = matchCond;
