import express from "express";

const router = express.Router();

import * as paymentController from "../controllers/paymentController";
import verifyJWT from "../middleware/authMiddleware";

//public endpoint where k2 posts stk push payload
router.post("/deposit/callback", paymentController.depositCallback);
//public endpoint where k2 posts webhook payload
router.post("/webhook/callback", paymentController.processWebhook); 

//require valid access token
router.use(verifyJWT);
//endpoints can be accessed when others are blocked to allow user to clear balance

router.get("/commissions", paymentController.getCommissions);
router.get("/activities", paymentController.getActivities);
//stk push
router.post("/deposit", paymentController.deposit);
//webhook subscription->not subscribed yet
router.post("/subscribe", paymentController.subscribeToWebhook);

export default router;
