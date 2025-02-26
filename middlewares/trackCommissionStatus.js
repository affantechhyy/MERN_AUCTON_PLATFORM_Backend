import {User} from "../models/userSchema.js"
import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js"

export const trackComissionStatus = catchAsyncErrors(async(req,res,next)=>{
    const user =await User.findById(req.user._id);
    // console.log(user.unpaidCommission)
    if(user.unpaidCommission>0){
        return next(new ErrorHandler("You have unpaid comission.Please pay them before posting a new auction.",403))
    }
    next();
})