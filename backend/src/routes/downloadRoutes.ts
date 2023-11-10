import express from "express";
import * as downloadController from "../controllers/downloadController";
import verifyJWT from "../middleware/authMiddleware";
const router = express.Router();

router.use(verifyJWT);

//don't use route parameters with file paths-> the route will have escaped characters like % and route won't match
//use query parameters
router.route("/single").get(downloadController.singleDownload);

router.route("/zip").post(downloadController.zipDownload);

export default router;
