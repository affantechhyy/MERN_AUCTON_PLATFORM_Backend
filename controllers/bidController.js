import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import  ErrorHandler  from "../middlewares/error.js"
import {Auction} from "../models/auctionSchema.js"
import {Bid} from "../models/bidSchema.js"
import {User} from "../models/userSchema.js"
export const placeBid = catchAsyncErrors(async(req, res, next)=>{
    const {id} = req.params;
    const auctionItem  = await Auction.findById(id);
    if(!auctionItem) {
        return next(new ErrorHandler("Auction item not found", 404))
    }
    const {amount} = req.body;
    if(!amount) {
        return next(new ErrorHandler("please place your bid", 404))
    }
    if(amount<=auctionItem.currentBid){
        return next(new ErrorHandler(`Bid amount must be higher than the current bid : ${auctionItem.currentBid}`, 404))
    }
    if(amount<=auctionItem.startingBid){
        return next(new ErrorHandler("Bid amount must be higher than the starting  bid", 404))
    }
  try{
    const existingBid = await Bid.findOne({
        "bidder.id": req.user._id,
        auctionItem: auctionItem._id,
    })
    // console.log(req.user._id);
    // console.log(auctionItem._id);
    
    const existingBidInAuction = auctionItem.bids.find(bid =>
        bid.userId.equals(req.user._id)
      );
    //   console.log(existingBidInAuction);
    //   console.log(existingBid) 
    // const existingBidInAuction = auctionItem.bids.find(
    //     bid => bid.userId.toString() == req.user._id.toString());
    if(existingBid && existingBidInAuction){//user n phle bid kii h 
        existingBid.amount = amount;
        existingBidInAuction.amount = amount;
        await existingBid.save();
        auctionItem.currentBid = amount;
        await auctionItem.save();
        // await existingBidInAuction.save();
    }else{//user n phle bid ki hi nii h 
        const bidderDetail =await User.findById(req.user._id);
        const bid = await Bid.create ({
            amount,
            bidder:{
                id:bidderDetail._id,
                username:bidderDetail.username,
                profileImage:bidderDetail.profileImage?.url,
            },
            auctionItem:auctionItem._id,
        })
        auctionItem.bids.push({
            userId:req.user._id,
            username:bidderDetail.username,
            profileImage:bidderDetail.profileImage?.url,
            amount,
            })  
        auctionItem.currentBid = amount;
        }
        await auctionItem.save();
        res.status(201).json({
            success:true, 
            message:"Bid placed successfully",
        currentBid:auctionItem.currentBid,
        });
    }catch(error){
       return next(new ErrorHandler(error.message || "Failed to place bid", 500));
    }
})