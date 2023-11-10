import express from "express";

const router = express.Router();

import * as chatController from "../controllers/chatController";
import * as messageController from "../controllers/messageController";
import verifyJWT from "../middleware/authMiddleware";
import uploader from "../middleware/fileUploadMiddleware";
import paymentGuard from "../middleware/paymentMiddleware";

const uploadChat = uploader({ dest: "uploads/chat" });


//require valid access token
router.use(verifyJWT);

//require outstanding bal to be less than min limit
//router.use(paymentGuard);

router.get("/", chatController.getChats);

router.get("/:id", messageController.getMessages);
router
  .route("/messages")
  .post(uploadChat.array("files"), messageController.postMessage);

router.patch("/messages/:id", messageController.updateMessageStatus);

router.delete("/messages/:id", messageController.deleteMessage);

export default router;
