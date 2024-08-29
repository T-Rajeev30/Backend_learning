import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {

    /* userName :String ,
    email: String,
    isActive : Boolean */

    //Professional Approach 
    userName :{
        type : String,
        required: true,
        unique : true,
        lowerCase : true
    },
    email : {
        type: String ,
        required : true,
        unique : true, 
        lowerCase : true,

    },
    password :{
        type : String ,
        required: [true , " password is required"]
    }

}
,{timestamps:true}
)

export const User = mongoose.model(
    "User" ,userSchema
)