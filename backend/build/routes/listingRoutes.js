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
const favoriteController = __importStar(require("../controllers/favoriteController"));
const listController = __importStar(require("../controllers/listController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const listingController = __importStar(require("../controllers/listingController"));
const rentalController = __importStar(require("../controllers/rentalController"));
const viewController = __importStar(require("../controllers/viewController"));
const agentAuthMiddleware_1 = __importDefault(require("../middleware/agentAuthMiddleware"));
const fileUploadMiddleware_1 = __importDefault(require("../middleware/fileUploadMiddleware"));
const upload = (0, fileUploadMiddleware_1.default)({ dest: "uploads/images" });
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
router.use(authMiddleware_1.default);
//favorite
router.get("/favorites", favoriteController.getFavorites);
router.patch("/favorites/add/:id", favoriteController.addFavorite);
router.patch("/favorites/remove/:id", favoriteController.removeFavorite);
//only users with all agent roles(renter+agent) can access listing apis
router.use(agentAuthMiddleware_1.default);
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
exports.default = router;
