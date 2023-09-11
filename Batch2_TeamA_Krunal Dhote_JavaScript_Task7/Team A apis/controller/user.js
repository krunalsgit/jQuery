const userModel = require("../model/user");
const educationModel = require("../model/education");
const educationController = require("./education");
const mongoose= require("mongoose")
module.exports.addUser = async (req, res) => {
  let userInformation = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    contactNumber: req.body.contactNumber,
    address: req.body.address,
  });

  await userInformation
    .save()
    .then(async (data) => {
      if (data) {
        var dataa = []
        for (let index = 0; index < req.body.Education.length; index++) {
          let educationDataa = {
            degree: req.body.Education[index].degree,
            instituteName: req.body.Education[index].instituteName,
            startDate: req.body.Education[index].startDate,
            passoutYear: req.body.Education[index].passoutYear,
            percentage: req.body.Education[index].percentage,
            backlogs: req.body.Education[index].backlogs,
            userDetails: userInformation.id,
          };
          dataa.push(educationDataa)

          //await educationController.addEducation(educationDataa);
        }
        await educationController.addEducation(dataa);
        res.json({ msg: "User saved Successfully", data: data });
        console.log(data);
      }
    })
    .catch((err) => {
      res.json({ msg: err });
      console.log(err);
    });



};
module.exports.getAllUserInformation = function (request, response) {
  userModel
    .aggregate([
      {
        $lookup: {
          from: "educationdetails",
          localField: "_id",
          foreignField: "userDetails",
          as: "Education",
        },
      },
    ])
    .then((data, err) => {
      if (data) {
        return response.send({ data: data });
      } else return response.json({ Error: err });
    });
};

module.exports.getUserById = async (request, response) => {
  const id = new mongoose.Types.ObjectId(request.params.id)
  await userModel
    .aggregate([
      {
        $match: { _id: id }
      },
      {
        $lookup: {
          from: "educationdetails",
          localField: "_id",
          foreignField: "userDetails",
          as: "Education",
        },
      },
    ])
    .then((data, err) => {
      if (data) {
        return response.send({ data });
      } else return response.json({ Error: err });
    });

}
module.exports.deleteUserInformationById = async (request, response) => {
  const id = request.params.id;
  await userModel.findByIdAndDelete(id).then((success, error) => {
    if (success) {
      response.json({ msg: "User and User Education deleted", status: 200 });
    } else {
      response.json({ err: error });
    }
  });
  const query = { userDetails: id };
  await educationModel.deleteMany(query);
  return true;
};

module.exports.updateUserInformationbyId = async (request, response) => {
  const userId = request.params.id;
  const query = { userDetails: userId };
  await educationModel.deleteMany(query).then((success) => {
    if (success) {
      return true;
    }
  });
  let userInformation = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    dateOfBirth: request.body.dateOfBirth,
    contactNumber: request.body.contactNumber,
    address: request.body.address,
  };

  await userModel
    .findByIdAndUpdate(userId, userInformation)
    .then(async (success, error) => {
      if (success) {
        var dataa = []
        for (let index = 0; index < request.body.Education.length; index++) {
         
          let educationDataa = {
            degree: request.body.Education[index].degree,
            instituteName: request.body.Education[index].instituteName,
            startDate: request.body.Education[index].startDate,
            passoutYear: request.body.Education[index].passoutYear,
            percentage: request.body.Education[index].percentage,
            backlogs: request.body.Education[index].backlogs,
            userDetails: userId,
          };

          dataa.push(educationDataa)

          //await educationController.addEducation(educationDataa);
        }
        await educationController.addEducation(dataa);
        response.json({ msg: "User updated successfully", status: 200, updatedUserData: success });
      } else {
        response.json({ err: error });
      }
    });

};
