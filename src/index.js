//require('dotenv').config({path:'./env'})
 
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

// Connect to MongoDB
connectDB()
.then(() =>{
  app.on('error' , (error)=>{
      console.log("Error in starting the server : " , error); 
      throw error
  })
  app.listen(process.env.PORT || 8000 , () =>{
    console.log(`Server is Running at port : ${process.env.PORT} `)
  } )

})
.catch((err) =>{
  console.log("DB connection error !!! " , err)
})



















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