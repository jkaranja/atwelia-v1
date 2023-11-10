import express from "express";
const router = express.Router();

import * as favoriteController from "../controllers/favoriteController";
import * as listController from "../controllers/listController";
import verifyJWT from "../middleware/authMiddleware";

import * as listingController from "../controllers/listingController";

import * as rentalController from "../controllers/rentalController";
import * as viewController from "../controllers/viewController";

import agentAuth from "../middleware/agentAuthMiddleware";
import uploader from "../middleware/fileUploadMiddleware";
import paymentGuard from "../middleware/paymentMiddleware";

const upload = uploader({ dest: "uploads/images" });

/*-----------------------------------------------------------
 * PUBLIC/GUEST
 ------------------------------------------------------------*/
//all rental/public listings
router.get("/rentals", rentalController.getAllListings);

//view single listing-->read only
router.get("/view/:id", viewController.getListing);

router.get("/related/:id", viewController.getRelatedListings);

/*-----------------------------------------------------------
 * PRIVATE
 ------------------------------------------------------------*/
//require valid access token
router.use(verifyJWT);
//favorite
router.get("/favorites", favoriteController.getFavorites);
router.patch("/favorites/add/:id", favoriteController.addFavorite);

router.patch("/favorites/remove/:id", favoriteController.removeFavorite);

//only users with all agent roles(renter+agent) can access listing apis
router.use(agentAuth);

//require outstanding bal to be less than min limit
//router.use(paymentGuard);

//listings
//list new
router.post("/list", upload.array("files"), listController.listNew);

router.get("/", listingController.getListings);
router
  .route("/:id")
  .put(upload.array("files"), listingController.updateListing);

router.patch("/:id", listingController.updateStatus);

router.delete("/:id", listingController.deleteListing);

export default router;
