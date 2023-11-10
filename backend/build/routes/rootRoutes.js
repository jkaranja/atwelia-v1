"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
/** this will serve a file for 404/ not found/ no route matched instead of plain texts
 * ^ = start with slash
 * $ =ends with slash
 * | =or  (if user hits / or index.html)
 * index(.html) = (html)? is optional//index or index.html=true
 * ? = makes proceeding character/character in bracket optional
 */
router.get("^/$|/index(.html)?", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "views", "index.html"));
});
exports.default = router;
