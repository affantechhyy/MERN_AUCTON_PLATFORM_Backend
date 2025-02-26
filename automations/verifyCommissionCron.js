import {Commission} from "../models/CommissionSchema.js";
import {PaymentProof} from "../models/commissionProofSchema.js";
import {User} from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import cron from "node-cron";


export const verifyCommissionCron = ()=>{
    cron.schedule("*/1 * * * *", async()=>{
        console.log("Running Verify Commission Cron...");
        const approvedProofs = await PaymentProof.find({status: "Approved"});
        for(const proof of approvedProofs){
            try{

                const user = await User.findById(proof.userId);
                let updatedUserData = {};
                if(user){
                    if(user.unpaidCommission >= proof.amount){
                        updatedUserData = await User.findByIdAndUpdate(user._id,{
                            $inc:{
                                unpaidCommission: - proof.amount
                            }
                        },
                    {new:true}
                );
                await PaymentProof.findByIdAndUpdate(proof._id, {
                    status:"Settled",
                });
                }else {
                    updatedUserData = await User.findByIdAndUpdate(
                        user._id,
                        {
                            unpaidCommission:0,
                    },
                {new:true}
            );
            await PaymentProof.findByIdAndUpdate(proof._id, {
                status:"Settled",
            });
                }
                await Commission.create({
                    amount:proof.amount,
                    user:user._id,
                });
                const settlementDate = new Date(Date.now())
                .toString()
                .substring(0,15);
                const subject = `Your payment has been sucessfully verified and settled`;
                const message = `Dear ${user.username},\n\nWe are pleased to inform you that your recent payment has been sucessfully verified and settled. Thankyou for promptly providing the necessary proof of payment.Your account has been updated,and you can now proceed with your activities on our platform without any restrictions.\n\nPayment Details:\n Amount settled: ${updatedUserData.unpaidCommission}\ndate of Settlement: ${settlementDate}\n\n, Best Regards,\nAffan auction Team`
                sendEmail({email:user.email,subject,message});
            }
            console.log(`User ${proof.userId} paid commission of ${proof.amount}`);
        }catch(error){
            console.log(`Error processing commission for user ${proof.userId}:${error.message}`); 
        }
    }
    })
}