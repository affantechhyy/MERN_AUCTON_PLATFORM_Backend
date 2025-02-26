import  express from "express";

import { register,login, getProfile, logout, fetchLeader } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router =express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated,getProfile);//is authenticate req.user ko lelega aur getprofile m pas krdegaa
router.get("/logout", isAuthenticated,logout);
router.get("/leader", fetchLeader);

export default router;