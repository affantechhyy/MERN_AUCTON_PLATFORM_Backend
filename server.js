import app from "./app.js"
import cloudinary from "cloudinary"
// import cors from 'cors';


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.listen(process.env.PORT, ()=>{
    console.log(`Server listening on  port ${process.env.PORT}`);
});
//change
// app.use(cors({
//     origin: 'http://localhost:5173/', // Allow requests from your frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true, // If using cookies/authentication
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));
