const mongoose=require("mongoose");
mongoose.connect('mongodb://0.0.0.0:27017/TeamAapis').then((res)=>{
    if(res){
        console.log("db Connected...."); 
    }
}).catch((err)=>{console.log(err)})