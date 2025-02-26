import mongoose from "mongoose";
const auctionSchema = new mongoose.Schema({
    title:String,
    description:String,
    startingBid:Number,
    category:String,
    condition:{
        type:String,
        enum:["new","used"]
    },
    currentBid:{ type: Number, default:0 },
    startTime: String,
    endTime: String,
//     endTime: {
//     type: Date,
//     required: true,
// },
    image :{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    bids:[
        {
            userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Bid",
            },
            username:String,
            profileImage:String,
            amount:Number
        },
    ],
    highestBidder:{
        type:mongoose.Schema.Types.ObjectId,
            ref:"User",
    },
    commissionCalculated:{
        type:Boolean,
        default: false
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});
export const Auction = mongoose.model("auction", auctionSchema);