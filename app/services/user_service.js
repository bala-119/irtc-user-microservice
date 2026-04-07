const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jsonwebtoken = require("../helpers/jsonwebtoken");

const {
  updateMpinSchema,
  updatePasswordSchema,
  updateProfileSchema,
  mobileOtpSchema,
  verifyMobileOtpSchema,
  emailOtpSchema,
  verifyEmailOtpSchema,
  aadhaarSchema
} = require("../validator/user_validatator");

// Validation helper
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
      errors
    };
  }
  return value;
};

class UserService {
  
  async getUsers() {
    return await User.find();
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async updateUser(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  // 🔹 MPIN
  async updateMpin(userId, data) {
    const validatedData = validate(updateMpinSchema, data);
    
    const hashedMpin = await bcrypt.hash(validatedData.mpin, 10);

    return await User.findByIdAndUpdate(
      userId,
      { mpin: hashedMpin },
      { new: true }
    );
  }

  // 🔹 PASSWORD
  async updatePassword(userId, data) {
    const validatedData = validate(updatePasswordSchema, data);

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    return await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  }

  // 🔹 PROFILE
  async updateProfile(userId, data) {
    const validatedData = validate(updateProfileSchema, data);

    return await User.findByIdAndUpdate(
      userId,
      validatedData,
      { new: true, runValidators: true }
    );
  }

  // 🔹 MOBILE OTP SEND
  async MobileOtpLogin(data) {
    const validatedData = validate(mobileOtpSchema, data);

    const response = await axios.post(
      "http://localhost:3002/v1/notification/send-mobile-otp",
      { mobile: validatedData.mobile }
    );

    return response.data;
  }

  // 🔹 MOBILE OTP VERIFY
  async VerifyMobileOtpLogin(data) {
    const validatedData = validate(verifyMobileOtpSchema, data);

    const response = await axios.post(
      "http://localhost:3002/v1/notification/verify-mobile-otp",
      validatedData
    );

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message
      };
    }

    const user = await User.findOne({ phone: validatedData.mobile });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const token = await jsonwebtoken.createToken(user);

    return {
      success: true,
      message: "OTP verified successfully",
      user,
      token
    };
  }

  // 🔹 EMAIL OTP SEND
  async emailOtpLogin(data) {
    const validatedData = validate(emailOtpSchema, data);

    const response = await axios.post(
      "http://localhost:3002/v1/notification/send-email-otp",
      validatedData
    );

    return response.data;
  }

  // 🔹 EMAIL OTP VERIFY LOGIN
  async verifyemailOtpLogin(data) {
    const validatedData = validate(verifyEmailOtpSchema, data);

    const response = await axios.post(
      "http://localhost:3002/v1/notification/verify-email-otp",
      validatedData
    );

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message
      };
    }

    const user = await User.findOne({ email: validatedData.email });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const token = await jsonwebtoken.createToken(user);

    return {
      success: true,
      message: "OTP verified successfully",
      user,
      token
    };
  }

  // 🔹 AADHAAR
  async setAadhaar(userId, data) {
    const validatedData = validate(aadhaarSchema, data);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        aadhaarId: validatedData.aadhaarId,
        aadhaarId_verified: true
      },
      { new: true }
    );

    if (!user) throw new Error("User not found");

    return user;
  }

  // 🔹 VERIFY EMAIL FOR TRUE
  async verifyEmailOtp_for_True(email, otp) {
    const response = await axios.post(
      "http://localhost:3002/v1/notification/verify-email-otp",
      { email, otp }
    );

    if (!response.data.success) {
      throw new Error("Invalid OTP");
    }

    const user = await User.findOneAndUpdate(
      { email },
      { email_verified: true },
      { new: true }
    );

    if (!user) throw new Error("User not found");

    return user;
  }

  // 🔹 VERIFY PHONE FOR TRUE
  async verifyPhoneOtp_for_True(mobile, otp) {
    const response = await axios.post(
      "http://localhost:3002/v1/notification/verify-mobile-otp",
      { mobile, otp }
    );

    if (!response.data.success) {
      throw new Error("Invalid OTP");
    }

    const user = await User.findOneAndUpdate(
      { phone: mobile },
      { phone_verified: true },
      { new: true }
    );

    if (!user) throw new Error("User not found");

    return user;
  }
}

module.exports = new UserService();