import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/CommissionRouter.js";
import superAdminRouter from "./router/SuperAdminRoutes.js";
import { endedAuctionCron } from "./automations/endedAuctionCron.js";
import {verifyCommissionCron} from "./automations/verifyCommissionCron.js"

const app= express();
config({
    path: "./config/config.env",
});

app.use(cors({
    origin :[process.env.FRONTEND_URL],
    methods:["POST", "GET", "PUT","DELETE"],
     allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,

})
);
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/temp",
})
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

endedAuctionCron();
verifyCommissionCron();
connection();
app.use(errorMiddleware);
export default app;
