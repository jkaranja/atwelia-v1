import express from "express";
import * as authController from "../controllers/authController";
import rateLimiter from "../middleware/limiterMiddleware";

const router = express.Router();

/*-----------------------------------------
 * login
 ----------------------------------------*/
/*----------------------------------------- 
 * PHONE NUMBER 
 ----------------------------------------*/
router.post("/login", rateLimiter, authController.login);

router.route("/refresh").get(authController.refresh);

router.route("/forgot").patch(rateLimiter, authController.forgotPassword);

router.route("/reset/:resetToken").patch(authController.resetPassword);

router.route("/logout").post(authController.logout);

export default router;
