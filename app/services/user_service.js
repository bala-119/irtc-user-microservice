const { response } = require("express");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jsonwebtoken = require("../helpers/jsonwebtoken");

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

  async updateMpin(userId, mpin) {

    if (!mpin) throw new Error("MPIN is required");

    const hashedMpin = await bcrypt.hash(mpin, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { mpin: hashedMpin },
      { new: true }
    );

    return updatedUser;
  }

  async updatePassword(userId, user_password) {
    console.log(user_password)
    //user not found
    if (!user_password) throw new Error("Password is required");

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    return updatedUser;
  }

  // only update name and phone
  async updateProfile(userId, data) {
// data not found
  if (!data) {
    throw new Error("No data provided");
  }
  // only name, phone  allowedFeilds
  const allowedFields = ["fullName", "phone","email"];

  const updateData = {};

  allowedFields.forEach(field => {
    if (data[field]) {
      updateData[field] = data[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  );

  return updatedUser;
}

async MobileOtpLogin(mobile)
{
  try{
  const rsponse = await axios.post("http://localhost:3001/v1/notification/send-mobile-otp",
    {mobile}
   
    
  );
   return response;
}catch(error)
{
  return error;

}


  

}
async VerifyMobileOtpLogin(mobile,otp)
{
  try{
    const response = await axios.post("http://localhost:3001/v1/notification/send-mobile-otp",{mobile,otp});
   return response;
  }catch(err)
  {
    throw err;
  }
  
   
}

async emailOtpLogin(email){
  try{
    const response = await axios.post("http://localhost:3001/v1/notification/send-email-otp",{email});
    return response.data;
  }catch(error)
  {
    throw  error;
  }

}

async verifyemailOtpLogin(email, otp) {
  try {
    
    const normalizedEmail = email.trim();

    // Call OTP service
    const response = await axios.post(
      "http://localhost:3001/v1/notification/verify-email-otp",
      { email: normalizedEmail, otp }
    );

    
    if (!response || !response.data) {
      return {
        success: false,
        message: "No response from OTP service"
      };
    }

    // OTP failed
    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "OTP verification failed"
      };
    }

    // ind user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }

    // generate token
    const token = await jsonwebtoken.createToken(user);

    // Final success response
    return {
      success: true,
      message: "OTP verified successfully",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName
      },
      token
    };

  } catch (err) {
   
    return {
      success: false,
      message:
        err.response?.data?.message ||  // API error
        err.message ||                 // general error
        "OTP verification failed"
    };
  }
}

 async setAadhaar(userId, aadhaarId) {
  try {

    const aadhaarRegex = /^\d{12}$/;

    if (!aadhaarRegex.test(aadhaarId)) {
      throw new Error("Aadhaar must be exactly 12 digits");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { aadhaarId: aadhaarId ,aadhaarId_verified : true},
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;

  } catch (error) {
    throw error;
  }
}
async verifyEmailOtp_for_True(email, otp) {
    // Call Notification Service
    const response = await axios.post(
      "http://localhost:3001/v1/notification/verify-email-otp",
      { email, otp }
    );

    // Check response
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || "OTP verification failed");
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Update verification status
    user.email_verified = true;
    await user.save();

    return user;
  }

  async verifyPhoneOtp_for_True(phone, otp) {
    console.log(phone,otp);
   
    const response = await axios.post(
      "http://localhost:3001/v1/notification/verify-mobile-otp",
      { phone, otp }
    );
    console.log(response.data);

    // Check response
    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || "OTP verification failed");
    }

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error("User not found");
    }

    // Update verification status
    user.phone_verified = true;
    await user.save();

    return user;
  }

}


module.exports = new UserService();