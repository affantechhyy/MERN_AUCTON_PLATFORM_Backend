import express from "express"
import {isAuthenticated,isAuthorized} from "../middlewares/auth.js";
import {updateProofStatus,
    getAllPaymentProofs,
    getPaymentProofDetail,
    removeAuctionItem,
    deletePaymentProof,
    fetchAllUsers,
    monthlyRevenue,
} from "../controllers/superAdminController.js";
const router = express.Router();

router.delete(
    "/auctionitem/delete/:id", 
    isAuthenticated,isAuthorized("Super Admin"),
    removeAuctionItem);
    
router.get("/paymentproofs/getall", 
        isAuthenticated,
        isAuthorized("Super Admin"), 
        getAllPaymentProofs);

router.get("/paymentproof/:id", 
    isAuthenticated,
    isAuthorized("Super Admin"), 
    getPaymentProofDetail);

router.put("/paymentproof/status/update/:id",
    isAuthenticated,
    isAuthorized("Super Admin"),
    updateProofStatus);

router.delete("/paymentproof/delete/:id",
    isAuthenticated,
    isAuthorized("Super Admin"),
    deletePaymentProof);
    
router.get("/users/getall",
    isAuthenticated,
    isAuthorized("Super Admin"),
    fetchAllUsers);

router.get("/monthlyincome",
    isAuthenticated,
    isAuthorized("Super Admin"),
    monthlyRevenue);


export default router;