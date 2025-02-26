import {addNewAuctionItem, deleteAuction, getallItem, getAuctionDetails, getMyAuctionItems, republishItem} from "../controllers/auctionitemController.js"
import {isAuthenticated, isAuthorized} from "../middlewares/auth.js"
import express from "express";
import { trackComissionStatus } from "../middlewares/trackCommissionStatus.js";
const router = express.Router();
router.post("/create", isAuthenticated,isAuthorized("Auctioneer"),trackComissionStatus, addNewAuctionItem);
router.get("/allItems",getallItem);
router.get("/myitems",isAuthenticated,isAuthorized("Auctioneer"),getMyAuctionItems);
router.get("/auction/:id",isAuthenticated,getAuctionDetails);
router.delete("/delete/:id",isAuthenticated,isAuthorized("Auctioneer"),deleteAuction);
router.put("/item/republish/:id",isAuthenticated,isAuthorized("Auctioneer"),republishItem)
export default router;
