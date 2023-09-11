const express= require('express');
const app=express();
var cors = require('cors')
var bodyParser = require('body-parser')
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(express.json());
app.use(cors())
require("./database/connection");
const route= require('./route/route')
app.use('/api',route)
const PORT= 1100;
app.listen(PORT,function(){
    console.log(`server started on ${PORT}`);  
  });