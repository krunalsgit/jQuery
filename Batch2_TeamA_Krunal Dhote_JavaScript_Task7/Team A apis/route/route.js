const express= require('express')
const route= express.Router();
const userController= require('../controller/user')
const educationController=require("../controller/education")

//add user with education(bydefault two education are complusory)
route.post('/addUser',userController.addUser)

//get all the users with their education

route.get('/getAllUser',userController.getAllUserInformation);

//update user with their education(bydefault two education are complusory)
route.put('/updateUser/:id',userController.updateUserInformationbyId);

//delete user(it will also delete all the education of that user)
route.delete('/deleteUserbyId/:id',userController.deleteUserInformationById);

route.get('/getUserById/:id', userController.getUserById)

//In case, required(get all the education lists)
//route.get('/getAllEducation',educationController.getAllEducationInformation);




module.exports = route;