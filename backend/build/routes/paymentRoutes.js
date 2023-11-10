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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const paymentController = __importStar(require("../controllers/paymentController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
//public endpoint where k2 posts stk push payload
router.post("/deposit/callback", paymentController.depositCallback);
//public endpoint where k2 posts webhook payload
router.post("/webhook/callback", paymentController.processWebhook);
//require valid access token
router.use(authMiddleware_1.default);
//endpoints can be accessed when others are blocked to allow user to clear balance
router.get("/commissions", paymentController.getCommissions);
router.get("/activities", paymentController.getActivities);
//stk push
router.post("/deposit", paymentController.deposit);
//webhook subscription->not subscribed yet
router.post("/subscribe", paymentController.subscribeToWebhook);
exports.default = router;
