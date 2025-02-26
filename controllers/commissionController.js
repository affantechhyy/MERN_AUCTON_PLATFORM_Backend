import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import {PaymentProof} from "../models/commissionProofSchema.js"
import {User} from "../models/userSchema.js"
import {v2  as cloudinary} from "cloudinary"
import mongoose from "mongoose";

export const calculateCommission = async(auctionId) => {
  // Types.ObjectId
  if(!mongoose.isValidObjectId(auctionId)){
    return next(new ErrorHandler("Invalid auction id format", 400))
  }
  
  const auction = await Auction.findById(auctionId);
  const commissionRate = 0.05;
  const commission = auction.currentBid * commissionRate;
  return commission;
}

export const proofOfCommission = catchAsyncErrors(async(req, res, next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Payment proof Screenshot is required"))
    }
    const {proof} = req.files;
    const {amount,comment} = req.body;
    const user = await User.findById(req.user._id);
    if(!amount || !comment){
        return next(new ErrorHandler("Amount and comment are required",400))
    }
    if(user.unpaidCommission === 0){
        return res.status(200).json({
            sucess:true,
            message:"You have no unpaid commission",
        })
    }
    if(user.unpaidCommission < amount){
        return next(new ErrorHandler(`the amount exceeds your unpaid commission.plase enter amount upto ${user.unpaidCommission}`,403))
    }
  const allowedFormats = ["image/png","image/jpeg","image/webp"];
  if (!allowedFormats.includes(proof.mimetype)) {
    return next(new ErrorHandler("Screenshot format not supported.", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(proof.tempFilePath,{
    folder: "MERN_AUCTION_PAYMENT_PROOF",
  }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown cloudinary error");
    return next(new ErrorHandler("failed to upload payment proof,", 500))
  }
  const commissionProof = await PaymentProof.create({
    userId: req.user._id,
    amount,
    comment,
    proof: {
        public_id : cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
    },
    });
    res.status(201).json({
        success: true,
        message: "Payment proof uploaded successfully, we will review and respond to you within 24 hours",
        commissionProof,
    })
})