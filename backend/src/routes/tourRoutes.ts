import express from "express";
const router = express.Router();

import * as tourController from "../controllers/tourController";
import verifyJWT from "../middleware/authMiddleware";
import paymentGuard from "../middleware/paymentMiddleware";

//require valid access token
router.use(verifyJWT);

//require outstanding bal to be less than min limit
//router.use(paymentGuard);

router.get("/renters", tourController.getRenterTours);
router.get("/agents", tourController.getAgentTours);

router.post("/", tourController.requestTour);

router.patch("/cancel/:id", tourController.cancelTour);

router.patch("/reschedule/:id", tourController.rescheduleTour);

router.patch("/end/:id", tourController.endTour);

router.patch("/confirm/:id", tourController.confirmTour);

router.patch("/decline/:id", tourController.declineTour);

router.delete("/:id", tourController.removeTour);

export default router;
