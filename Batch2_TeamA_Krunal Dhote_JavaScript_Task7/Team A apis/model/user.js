const mongoose = require("mongoose");
const userSchema= new mongoose.Schema({

    firstName:{
         type:String
    },
    lastName:{
        type:String
    },
    dateOfBirth:{
        type:Date
    },
    contactNumber:{
        type:Number
    },
    email:{
        type:String
    },
    address:{
        type:String
    }

});

const userModel= mongoose.model("userDetail",userSchema)

module.exports=userModel;   