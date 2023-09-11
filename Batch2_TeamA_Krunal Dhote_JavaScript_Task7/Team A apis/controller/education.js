const educationModel = require("../model/education");
module.exports.addEducation = (requesttt, response) => {

  // let degree = requesttt.degree;
  // let instituteName = requesttt.instituteName;
  // let startDate = requesttt.startDate;
  // let passoutYear = requesttt.passoutYear;
  // let percentage = requesttt.percentage;
  // let backlogs= requesttt.backlogs;
  // let userDetails = requesttt.userDetails;

  // let educationInformation = new educationModel({
  //   degree: degree,
  //   instituteName: instituteName,
  //   startDate: startDate,
  //   passoutYear: passoutYear,
  //   percentage: percentage,
  //   backlogs:backlogs,
  //   userDetails: userDetails,
  // });

  educationModel
    .insertMany(requesttt)
    .then((data) => {
      if (data) {
       return data;
      }
    })
    .catch((err) => {
     return err;
    });
};

module.exports.getAllEducationInformation = function (request, response) {
  educationModel
    .find({})
    .populate("userDetails")
    .then((data, err) => {
      if (data) {
        response.json({ data: data });
      } else return response.json({ Error: err });
    });
};

// module.exports.deleteProductInformationById = (request, response) => {
//   const id = request.params.id;
//   educationModel.findByIdAndDelete(id).then((success, error) => {
//     if (success) {
//       response.json({ msg: "Product deleted", status: 200 });
//     } else {
//       response.json({ err: error });
//     }
//   });
// };
