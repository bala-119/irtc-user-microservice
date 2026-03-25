// const { statusCodes } = require("../response/httpStatusCodes");
// const { statusMessage } = require("../response/httpStatusMessages");
// const { messages } = require("../response/customMessages");
// const bcrypt = require("bcryptjs");
// const { pageMetaService, sendOTP_to_email } = require("../helpers");

// const adminLoginService = async (params) => {
//   // get admin details by email
//   let result = await Admin.findOne({
//     email: params?.email,
//     isDeleted: false,
//   });
//   //console.log("result-->", result);
//   if (result) {
//     if (!result.isActive) {
//       //console.log("result-->", result);
//       return {
//         status: false,
//         statusCode: statusCodes?.HTTP_BAD_REQUEST,
//         message: statusMessage.notActive,
//       };
//     }
//     if (result.isDeleted) {
//       //console.log("result 11-->", result);
//       return {
//         status: false,
//         statusCode: statusCodes?.HTTP_BAD_REQUEST,
//         message: "User not found",
//       };
//     }
//     const admin = result;
//     //console.log("admin -->", admin);
//     //compare given password and stored password by user
//     const isMatch = await bcrypt.compare(params?.password, admin.password);
//     if (!isMatch) {
//       return {
//         status: false,
//         statusCode: statusCodes?.HTTP_BAD_REQUEST,
//         message: statusMessage.invalidPwd,
//         data: [],
//       };
//     }

//     const token = jwt.sign(
//       {
//         _id: admin._id ? admin._id.toString() : "",
//         name: admin.name ? admin.name.toString() : "",
//         mobileNumber: admin.mobileNumber ? admin.mobileNumber.toString() : "",
//       },
//       process.env.JWT_ADMIN_SECRET
//       //  { expiresIn: process.env.TOKEN_EXPIRATION }
//     );

//     admin.token = token;
//     return {
//       status: true,
//       statusCode: statusCodes?.HTTP_OK,
//       message: messages?.loginSuccessful,
//       data: admin,
//     };
//   } else {
//     return {
//       status: false,
//       statusCode: statusCodes?.HTTP_BAD_REQUEST,
//       message: messages?.userNotExist,
//       data: [],
//     };
//   }
// };

// module.exports = {
//   adminLoginService,
// };
