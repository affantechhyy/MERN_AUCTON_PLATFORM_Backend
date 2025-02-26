import {isAuthenticated, isAuthorized} from "../middlewares/auth.js";
import { proofOfCommission } from "../controllers/commissionController.js"; 
import express from "express"
const router = express.Router();
router.post("/proof",isAuthenticated,isAuthorized("Auctioneer"),proofOfCommission);
export default router;
