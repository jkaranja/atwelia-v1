import express from "express";

const router = express.Router();
import verifyJWT from "../middleware/authMiddleware";
import * as notificationController from "../controllers/notificationController";
import optionalJWT from "../middleware/optionalMiddleware";

router.use(optionalJWT);
//save push token
router.route("/").put(notificationController.savePushToken);

//require valid access token
router.use(verifyJWT);

router.get("/", notificationController.getNotifications);

router.patch("/", notificationController.removeTourNotifications);

router.patch("/:id", notificationController.removeInboxNotifications);

export default router;
