const authService = require("../services/authService");
const axios = require("axios");
const User = require("../models/user_model");
const user_service = require("../services/user_service");
const bcrypt = require("bcrypt");
const { validateInput, passwordValidator,phoneValidator,emailValidator } = require("../middlewares/inputValidator");
const updateValidator = require("../middlewares/updateValidator");
const validateUpdateInput = require("../middlewares/updateValidator");
const { isValidElement } = require("react");

class AuthController {

    // REGISTER USER
    async register(req, res) {
        try {

       
        const { isValid, errors } = validateInput(req.body);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed. kindly fill the required field in correct format",
                errors
            });
        }
            const result = await authService.register(req.body);
            

            if (!result.success) {
            return res.status(400).json(result);
        }

       
        return res.status(201).json({
            success: true,
            message: "Registered successfully.",
            data: result.data
        });

        } catch (error) {

            console.error("Register error:", error.message);

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

    async login(req,res){
        try{
            //get user data
            var result =await authService.login(req.body);
            
            if(result)
            {
                res.status(200).json({
                    sucess : true,
                    message : "login sucessfull",
                    data : result.user,
                    token : result.token
                });
            }
        }
        catch(error)
        { 
             res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }


    // VERIFY EMAIL OTP
  async verifyEmailOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP required"
            });
        }

        const response = await axios.post(
            "http://localhost:3001/notification/verify-email-otp",
            { email, otp }
        );

        console.log(response.data.success); 

      
        if (response.data.success) {

            await User.updateOne(
                { email: email },
                { email_verified: true }
            );
        }

        res.json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.response?.data?.message || error.message
        });

    }
}

async updateMpin(req, res) {
  try {
    const userId = req.user.id; // from token
    const { mpin } = req.body;

    //  Check if mpin exists
    if (!mpin) {
      return res.status(400).json({
        success: false,
        message: "MPIN is required"
      });
    }

    //  Validate 5-digit mpin
    const mpinRegex = /^\d{5}$/;

    if (!mpinRegex.test(mpin)) {
      return res.status(400).json({
        success: false,
        message: "MPIN must be exactly 5 digits"
      });
    }

    //  prevent weak MPINs 
    const weakMpins = ["12345", "00000", "11111", "22222", "33333", "44444", "55555","66666","777777","88888","99999","00000","54321"];
    if (weakMpins.includes(mpin)) {
      return res.status(400).json({
        success: false,
        message: "Choose a stronger MPIN"
      });
    }

  
    const updatedUser = await user_service.updateMpin(userId, mpin);

    return res.json({
      success: true,
      message: "MPIN updated successfully",
      data: updatedUser
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
async updatePassword(req, res) {
  try {
    const userId = req.user.id; // from token
    const { password } = req.body;

    // Check if password exists
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    // Validate password
    const { isValid, errors } = passwordValidator(password);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    //  Call service
    const updatedUser = await user_service.updatePassword(userId, password);

    return res.json({
      success: true,
      message: "Password updated successfully",
      data: updatedUser
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
async updateProfile(req, res) {
    try {

        const userId = req.user.id;
        const data = req.body;

        //  Empty check
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide data to update"
            });
        }

        //  Validate
        const { isValid, errors } = validateUpdateInput(data);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed. Please provide valid input",
                errors
            });
        }

        //  Remove undefined/null
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
        );

        //  Allow only safe fields
        const allowedFields = ["fullName", "email", "phone"];

        const safeData = Object.fromEntries(
            Object.entries(filteredData).filter(([key]) =>
                allowedFields.includes(key)
            )
        );

        //  Prevent empty update
        if (Object.keys(safeData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        
        const updatedUser = await user_service.updateProfile(userId, safeData);

        return res.json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
async forgotPassword(req, res) {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // call notification microservice
        const response = await axios.post(
            "http://localhost:3001/v1/notification/send-email-otp",
            { email }
        );

        res.json({
            success: true,
            message: "OTP sent to email"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}
async resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    //  Required fields
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password required"
      });
    }

    //  Check if user exists 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email"
      });
    }

    // Validate password
    const { isValid, errors } = passwordValidator(newPassword);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Password validation failed",
        errors
      });
    }

    // Verify OTP
    const response = await axios.post(
      "http://localhost:3001/v1/notification/verify-email-otp",
      { email, otp }
    );

    if (!response.data || !response.data.success) {
      return res.status(400).json({
        success: false,
        message: response.data?.message || "Invalid or expired OTP"
      });
    }

    //  Prevent same password reuse
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password"
      });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { password: hashedPassword }
    );

    return res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Reset Password Error:", error.message);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
    });
  }
}

async MpinLogin(req, res) {
  try {
    const { phone, mpin } = req.body;

    if (!phone || !mpin) {
      return res.status(400).json({
        success: false,
        message: "Phone and MPIN are required"
      });
    }

    const result = await authService.MpinLogin(phone, mpin);

    
    return res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}

async MobileOtpLogin(req,res){
    try{
        const {mobile} = req.body;
        if(!mobile){
            throw new Error("monile number required");
        }
        const user = await User.findOne({ mobile });
        if(!user)
        {
            res.status(404).json({
                sucess : false,
                message : " User not fould with the mobile number"
            })
        }

        let result = await user_service.MobileOtpLogin(mobile);
        
    

        res.json({
            status: true,
            message : " Login OTP send sucessfully",
            data : result
        })

    }catch(error)
    {
        res.json({
            message : error.message,
            status : false
        })
    }
}
async VerifyMobileOtpLogin(req,res)
{ 
    try{

     if(!req)
{
    throw new Error("please provide phone number and otp")
}
    var {mobile} = req.mobile;
    var {otp} = req.otp;
    var result = await user_service.VerifyMobileOtpLogin(mobile,otp);
    // if(!result)
    // {
    //     throw new Error("error from user_service ");
    // }
    // return res.status(200).json({
    //     sucess: true,
    //     message : "Otp verified sucessfully",
    //     data : result
    // })
    return result;

}catch(error){ error}

}

async emailOtpLogin(req,res)
{
    try{
        
        var {email} = req.body;
        console.log(email)
        if(!email)
        {
            throw new Error("email not found");
        }
        const {isValid,errors} = emailValidator(email);
            if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "email validation failed. please provide correct email format",
        errors
      });
    }
         const user = await User.findOne({ email });
         //console.log(user);
        if(!user)
        {
            res.status(404).json({
                success : false,
                message : " User not fould with the email id"
            })
        }
        const data = await user_service.emailOtpLogin(email);
        // return res.status(200).json({
        //     sucess:true,
        //     message : "OTP send sucessfully",
        //     data : s_user
        // })
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: data
        });
        

    }catch(error)
    {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}
async verifyemailOtpLogin(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const result = await user_service.verifyemailOtpLogin(email, otp);

   
    return res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}
async setAadhaar(req, res) {
  try {

    const userId = req.user.id;   // from token
    const { aadhaarId } = req.body;

    const user = await user_service.setAadhaar(userId, aadhaarId);

    return res.status(200).json({
      success: true,
      message: "Aadhaar added successfully",
      data: user
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
}

async getUserbyId(req,res)
{
    try{
        const id = req.params.id;
        const user = user_service.getUserById(id);
        return res.status(200).json({
      success: true,
      message: "User written successfully",
      data: user
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

    }
}

// async getUserById(req, res) {
//     try {
//       const userId = req.params.id; 
//       if (!userId) {
//         return res.status(400).json({
//           success: false,
//           message: "User ID is required",
    
//         });
//       }

//       // Call the User microservice
//       const response = await axios.get(
//         `http://USER_SERVICE_HOST/api/users/${userId}`
//       );

//       const user = response.data?.data;

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         data: user,
//       });

//     } catch (err) {
//       console.error("getUserById Error:", err.message);

//       // Handle microservice errors
//       if (err.response) {
//         return res.status(err.response.status).json({
//           success: false,
//           message: err.response.data?.message || "Error fetching user",
//         });
//       }

//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   }

async verifyEmailOtp_for_true(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP required"
        });
      }

      const user = await user_service.verifyEmailOtp_for_True(email, otp);
      console.log(user);
      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: user
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        
      });
    }
}
async verifyPhoneOtp_for_true(req, res) {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        return res.status(400).json({
          success: false,
          message: "phone and OTP required"
        });
      }

      const user = await user_service.verifyPhoneOtp_for_True(phone, otp);
      console.log(user);
      return res.status(200).json({
        success: true,
        message: "phone verified successfully",
        data: user
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        
      });
    }
}
}


module.exports = new AuthController();