import express from "express";

const router = express.Router();

import * as userController from "../controllers/userController";
import * as profileController from "../controllers/profileController";
import verifyJWT from "../middleware/authMiddleware";

import rateLimiter from "../middleware/limiterMiddleware";
import uploader from "../middleware/fileUploadMiddleware";

const upload = uploader({ dest: "uploads/profile" });

router.route("/register").post(rateLimiter, userController.registerUser);

router.route("/profile/:id").get(profileController.getProfile);

//this will apply protected middleware(require access token) to all private routes below//put public user routes above
router.use(verifyJWT);

router.route("/").get(userController.getUser);

router
  .route("/")
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route("/profile")
  .post(upload.single("profilePic"), profileController.createProfile);

router.route("/profile").patch(
  upload.single("profilePic"),

  profileController.updateProfile
);

export default router;
