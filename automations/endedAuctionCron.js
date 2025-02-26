//terminal crash hobhi jaye to bhi y run kregaa agr backend run krra ho ---rsn to use cron
import cron from "node-cron";
import {Auction} from "../models/auctionSchema.js";
import {User} from "../models/userSchema.js";
import {Bid} from "../models/bidSchema.js";
import { calculateCommission } from "../controllers/commissionController.js";
import { sendEmail } from "../utils/sendEmail.js";

export const endedAuctionCron = () => { //min,hour,days,month,year
    cron.schedule("*/1 * * * *", async()=> {
        //--
        const auctions = await Auction.find({
            commissionCalculated: false,
          });
          
          const now = new Date();
          const endedAuctions = auctions.filter(auction => {
            // Convert the auction's endTime string to a Date object
            const auctionEndDate = new Date(auction.endTime);
            return auctionEndDate < now;
          });
          
        //   endedAuctions.forEach(auction => {
        //     console.log(`Auction ID: ${auction._id}, End Time: ${auction.endTime}, Current Time: ${now}`);
        //   });
          //--
          
        // const now = new Date();
        // // console.log(now.toISOString());
        // console.log("Cron for ended auction running...");
        // const endedAuctions = await Auction.find({
        //     endTime: { $lt: now },
        //     commissionCalculated:false,
        // });
        // console.log(new Date("2025-02-23T11:05:00Z") < now);
        // console.log("Checking ended auctions...");
        // for (const auction of endedAuctions) {

        //console.log(
        //         "End Time (UTC):", auction.endTime.toISOString(),
        //         "Current Time (UTC):", now.toISOString(),
        //         "IsEnded:", auction.endTime < now
        //       );              
        //   }          
        // console.log("m hu 2nd wala");
        // console.log("m hu2nd", endedAuctions2);
        // console.log("endedAuctions length:", endedAuctions.length);
        for(const auction of endedAuctions){
            try{
                // console.log("Auction ID:", auction._id, typeof auction._id);
                // console.log("Auction Current Bid:", auction.currentBid, typeof auction.currentBid);
                const commissionAmount = await calculateCommission(auction._id);
                // console.log(commissionAmount);
                auction.commissionCalculated = true;
                const highestBidder = await Bid.findOne({
                    auctionItem: auction._id,
                    amount: auction.currentBid,
                  });
                // console.log("Highest Bidder:", highestBidder)
                const auctioneer = await User.findById(auction.createdBy);
                auctioneer.unpaidCommission = commissionAmount;
                if(highestBidder){
                    console.log(highestBidder);
                    auction.highestBidder = highestBidder.bidder.id;
                    await auction.save();
                    const bidder = await User.findById(highestBidder.bidder.id);
                    await User.findByIdAndUpdate(bidder._id, {
                        $inc:{
                            moneySpent:highestBidder.amount,
                            auctionsWon:1,
                        },
                    },
                    {new:true}
                );
                await User.findByIdAndUpdate(auctioneer._id,{
                    $inc:{
                        unpaidCommission:commissionAmount,
                        },
                },
                {new:true});
                const subject =  `Congratulations! You won the auction for ${auction.title}`;
                const message = `Dear ${bidder.username}, \n\nCongratulations! you have won the auction for ${auction.title}. \n\nBefore proceeding for payment contact your auctioneer via your auctioneer email:${auctioneer.email}.\n\nPlease complete your payment using one of the following payment methods\n\n1.**Bank Transfer**: \n- Account Name: ${auctioneer.PaymentMethods.bankTransfer.bankAccountName} \n- Account Number: ${auctioneer.PaymentMethods.bankTransfer.bankAccountNumber}\n' Bank:${auctioneer.PaymentMethods.bankTransfer.bankName}\n\n2. **GooglePay**:\n- You can send payment via Easypaise: ${auctioneer.PaymentMethods.googlepay.googlepayNumber}\n\n3. **Paypal**:\n- Send payment to: ${auctioneer.PaymentMethods.paypal.paypalEmail}\n\n4. **Cash on Delivery (COD)**:\n- if you prefer COD, you must pay 20% of total amount upfront before delivery.\n- To pay the 20% upfront,use any of the above methods.\n- The remaining 80% will be paid upon delivery\n- If you want to see the condition of your auction item then send your email on this: ${auctioneer.email}\n\nPlease ensure your payment is compeleted by [Payment Due Date].once we confirm the payment, the item will be shipped to you.\n\nThankyou for participating!\n\nBest Regards,\nAffan Auction Team`;
                console.log("SENDING EMAIL TO HIGHEST BIDDER");
                sendEmail({email:bidder.email,subject, message});
                console.log("SUCESSFULLY EMAIL SENT TO HIGHEST BIDDER");
                }else{
                    auction.save();
                }
            } catch(error){
                return next(console.log(error || "Some error in ended auction cron"));
            }
        }
    })  
}
