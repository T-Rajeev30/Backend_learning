//require('dotenv').config({path:'./env'})
 
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

// Connect to MongoDB
connectDB();
// import express from "express";
// const app = express()
// ( async () =>{
//     try {
//         mongoose.connect(`${process.env.MONGOOSE_URL}/${DB_NAME} `)
//         app.on('error' , (error)=>{
//             console.log("Error : " , error); 
//             throw error
//         })
//         app.listen(process.env.PORT , () =>{
//             console.log(`APP is   listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("ERROR :" , error)
//         throw error
//     }
// } )()