import mongoose from "mongoose";
export const connection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"MERN_AUCTION_PLATFORM"
    }).then(()=>{
       
        console.log("db connected sucessfully");
    }).catch((err)=>{
        console.log(err);
    });
}