const authService = require("../services/authService");
const axios = require("axios");
const User = require("../models/user_model");
const user_service = require("../services/user_service");
const bcrypt = require("bcrypt");
const { 
  registerSchema,
  loginSchema,
  resetPasswordSchema, 
  mpinLoginSchema, 
  mobileOtpSchema,
  verifyMobileOtpSchema,
  emailOtpSchema,
  verifyEmailOtpSchema,
  forgotPasswordSchema,
  verifyEmailOtpForTrueSchema,
  verifyPhoneOtpForTrueSchema,
  updateMpinSchema,
  updatePasswordSchema,
  updateProfileSchema,
  aadhaarSchema
} = require("../validator/user_validatator");

// Validation helper function with detailed error formatting
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    
    throw {
      status: 400,
      success: false,
      message: "Validation failed",
      errors: errors
    };
  }
  
  return value;
};

class AuthController {

  // ✅ REGISTER
  async register(req, res) {
    try {
      // Validate input
      const validatedData = validate(registerSchema, req.body);
      
      const result = await authService.register(validatedData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = result.data.toObject();

      return res.status(201).json({
        success: true,
        message: "Registered successfully",
        data: userWithoutPassword
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Internal server error" 
      });
    }
  }

  // ✅ LOGIN
  async login(req, res) {
    try {
      const validatedData = validate(loginSchema, req.body);
      const result = await authService.login(validatedData);

      return res.json({
        success: true,
        message: "Login successful",
        data: result.user,
        token: result.token
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(401).json({ 
        success: false, 
        message: error.message || "Invalid credentials" 
      });
    }
  }

  // ✅ VERIFY EMAIL OTP
  async verifyEmailOtp(req, res) {
    try {
      const validatedData = validate(verifyEmailOtpSchema, req.body);
      const { email, otp } = validatedData;
      
      const response = await axios.post(
        "http://localhost:3002/v1/notification/verify-email-otp",
        { email, otp }
      );

      if (response.data.success) {
        await User.updateOne(
          { email: email },
          { email_verified: true }
        );
      }

      return res.json({
        success: true,
        message: "Email verified successfully"
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({
        success: false,
        message: error.response?.data?.message || error.message
      });
    }
  }

  // ✅ UPDATE MPIN
  async updateMpin(req, res) {
    try {
      const validatedData = validate(updateMpinSchema, req.body);
      const updatedUser = await user_service.updateMpin(req.user.id, validatedData);

      return res.json({
        success: true,
        message: "MPIN updated successfully",
        data: updatedUser
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ UPDATE PASSWORD
  async updatePassword(req, res) {
    try {
      const validatedData = validate(updatePasswordSchema, req.body);
      
      // Verify current password
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      
      const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: "Current password is incorrect" });
      }
      
      const updatedUser = await user_service.updatePassword(req.user.id, validatedData);

      return res.json({
        success: true,
        message: "Password updated successfully",
        data: updatedUser
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ UPDATE PROFILE
  async updateProfile(req, res) {
    try {
      const validatedData = validate(updateProfileSchema, req.body);
      
      // Check if email is being updated and if it already exists
      if (validatedData.email) {
        const existingUser = await User.findOne({ 
          email: validatedData.email, 
          _id: { $ne: req.user.id } 
        });
        if (existingUser) {
          return res.status(400).json({ 
            success: false, 
            message: "Email already in use" 
          });
        }
      }
      
      // Check if phone is being updated and if it already exists
      if (validatedData.phone) {
        const existingUser = await User.findOne({ 
          phone: validatedData.phone, 
          _id: { $ne: req.user.id } 
        });
        if (existingUser) {
          return res.status(400).json({ 
            success: false, 
            message: "Phone number already in use" 
          });
        }
      }
      
      const updatedUser = await user_service.updateProfile(req.user.id, validatedData);
 
       return res.json({
         success: true,
         message: "Profile updated successfully",
         data: updatedUser
       });
 
     } catch (error) {
       if (error.status === 400) {
         return res.status(400).json(error);
       }
       return res.status(400).json({ 
         success: false, 
         message: error.message 
       });
     }
   }
 
   // ✅ GET PROFILE
   async getProfile(req, res) {
     try {
       const user = await user_service.getUserById(req.user.id);
       if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
       }
       // Remove sensitive data
       const { password, ...userWithoutPassword } = user.toObject();
       return res.json({ success: true, user: userWithoutPassword });
     } catch (error) {
       return res.status(500).json({ success: false, message: error.message });
     }
   }

  // ✅ FORGOT PASSWORD
  async forgotPassword(req, res) {
    try {
      const validatedData = validate(forgotPasswordSchema, req.body);
      const { email } = validatedData;
      
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      await axios.post(
        "http://localhost:3002/v1/notification/send-email-otp",
        { email: email }
      );

      return res.json({
        success: true,
        message: "OTP sent to email"
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ RESET PASSWORD
  async resetPassword(req, res) {
    try {
      const validatedData = validate(resetPasswordSchema, req.body);
      const { email, otp, newPassword } = validatedData;

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      const response = await axios.post(
        "http://localhost:3002/v1/notification/verify-email-otp",
        { email, otp }
      );

      if (!response.data.success) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid OTP" 
        });
      }

      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return res.status(400).json({ 
          success: false, 
          message: "Cannot reuse old password" 
        });
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await User.updateOne(
        { email: email },
        { password: hashed }
      );

      return res.json({
        success: true,
        message: "Password reset successful"
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ MPIN LOGIN
  async MpinLogin(req, res) {
    try {
      const validatedData = validate(mpinLoginSchema, req.body);
      const result = await authService.MpinLogin(validatedData.phone, validatedData.mpin);

      return res.status(result.success ? 200 : 400).json(result);

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ MOBILE OTP LOGIN
  async MobileOtpLogin(req, res) {
    try {
      const validatedData = validate(mobileOtpSchema, req.body);
      const { mobile } = validatedData;

      const user = await User.findOne({ phone: mobile });
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      const result = await user_service.MobileOtpLogin({ mobile });

      return res.json({
        success: true,
        message: "OTP sent successfully",
        data: result
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ VERIFY MOBILE OTP
  async VerifyMobileOtpLogin(req, res) {
    try {
      const validatedData = validate(verifyMobileOtpSchema, req.body);
      const result = await user_service.VerifyMobileOtpLogin(validatedData);

      return res.json(result);

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ EMAIL OTP LOGIN
  async emailOtpLogin(req, res) {
    try {
      const validatedData = validate(emailOtpSchema, req.body);
      const { email } = validatedData;

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      const data = await user_service.emailOtpLogin({ email });

      return res.json({
        success: true,
        message: "OTP sent successfully",
        data
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ VERIFY EMAIL OTP LOGIN
  async verifyemailOtpLogin(req, res) {
    try {
      const validatedData = validate(verifyEmailOtpSchema, req.body);
      const result = await user_service.verifyemailOtpLogin(validatedData);

      return res.json(result);

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ SET AADHAAR
  async setAadhaar(req, res) {
    try {
      const validatedData = validate(aadhaarSchema, req.body);
      const user = await user_service.setAadhaar(req.user.id, validatedData);

      return res.json({
        success: true,
        message: "Aadhaar added successfully",
        data: user
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ GET USER BY ID
  async getUserbyId(req, res) {
    try {
      const user = await user_service.getUserById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      // Remove sensitive data
      const { password, mpin, ...userWithoutSensitive } = user.toObject();

      return res.json({
        success: true,
        data: userWithoutSensitive
      });

    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ VERIFY EMAIL TRUE
  async verifyEmailOtp_for_true(req, res) {
    try {
      const validatedData = validate(verifyEmailOtpForTrueSchema, req.body);
      const { email, otp } = validatedData;
      
      const user = await user_service.verifyEmailOtp_for_True(email, otp);

      return res.json({
        success: true,
        message: "Email verified successfully",
        data: user
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ✅ VERIFY PHONE TRUE
  async verifyPhoneOtp_for_true(req, res) {
    try {
      const validatedData = validate(verifyPhoneOtpForTrueSchema, req.body);
      const { mobile, otp } = validatedData;
      
      const user = await user_service.verifyPhoneOtp_for_True(mobile, otp);

      return res.json({
        success: true,
        message: "Phone verified successfully",
        data: user
      });

    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json(error);
      }
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new AuthController();