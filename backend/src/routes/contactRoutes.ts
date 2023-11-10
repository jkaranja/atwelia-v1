import express from "express";

const router = express.Router();

import * as contactController from "../controllers/contactController";

router.route("/").post(contactController.contactUs);

export default router;
