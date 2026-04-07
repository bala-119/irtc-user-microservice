const Joi = require("joi");

// REGISTER
const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(50).required(),
  user_name: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().pattern(/^\+91\d{10}$/).required(),
  password: Joi.string().trim().min(6).required(),
  role: Joi.string().trim().valid("user", "admin").default("user")
});

// LOGIN
const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required()
});

// MPIN LOGIN
const mpinLoginSchema = Joi.object({
  phone: Joi.string().required(),
  mpin: Joi.string().length(5).required()
});

// UPDATE MPIN
const updateMpinSchema = Joi.object({
  mpin: Joi.string().length(5).required()
});

// UPDATE PASSWORD
const updatePasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

// EMAIL OTP
const emailOtpSchema = Joi.object({
  email: Joi.string().email().required()
});

const verifyEmailOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required()
});

// MOBILE OTP
const mobileOtpSchema = Joi.object({
  mobile: Joi.string().required()
});

const verifyMobileOtpSchema = Joi.object({
  mobile: Joi.string().required(),
  otp: Joi.string().required()
});

// RESET PASSWORD
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// AADHAAR
const aadhaarSchema = Joi.object({
  aadhaarId: Joi.string().length(12).required()
});

// UPDATE PROFILE
const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.string()
});

module.exports = {
  registerSchema,
  loginSchema,
  mpinLoginSchema,
  updateMpinSchema,
  updatePasswordSchema,
  emailOtpSchema,
  verifyEmailOtpSchema,
  mobileOtpSchema,
  verifyMobileOtpSchema,
  resetPasswordSchema,
  aadhaarSchema,
  updateProfileSchema
};