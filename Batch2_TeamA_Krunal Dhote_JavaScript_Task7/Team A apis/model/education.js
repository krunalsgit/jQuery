const mongoose = require("mongoose");
const educationSchema= new mongoose.Schema({

    degree:{
         type:String
    },
    instituteName:{
        type:String
    },
    startDate:{
        type:Date
    },
    passoutYear:{
        type:Number
    },
    percentage:{
        type:Number
    },
     backlogs:{
        type:Number
     },
    userDetails:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userDetail"
    }
    
});

const educationModel= mongoose.model("educationDetail",educationSchema)

module.exports=educationModel;