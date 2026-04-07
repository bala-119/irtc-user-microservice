const Joi = require("joi");

// Custom validators
const phoneRegex = /^\+91\d{10}$/;
const mpinRegex = /^\d{5}$/;
const aadhaarRegex = /^\d{12}$/;

// REGISTER Schema
const registerSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters'
    }),
  
  user_name: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
    }),
  
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  phone: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be in format +91XXXXXXXXXX'
    }),
  
  password: Joi.string()
    .trim()
    .min(6)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 50 characters'
    }),
  
  role: Joi.string()
    .trim()
    .valid("user", "admin")
    .default("user")
    .messages({
      'any.only': 'Role must be either "user" or "admin"'
    })
});

// LOGIN Schema
const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  password: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// MPIN LOGIN Schema
const mpinLoginSchema = Joi.object({
  phone: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be in format +91XXXXXXXXXX'
    }),
  
  mpin: Joi.string()
    .trim()
    .pattern(mpinRegex)
    .required()
    .messages({
      'string.empty': 'MPIN is required',
      'string.pattern.base': 'MPIN must be exactly 5 digits'
    })
});

// UPDATE MPIN Schema
const updateMpinSchema = Joi.object({
  mpin: Joi.string()
    .trim()
    .pattern(mpinRegex)
    .required()
    .messages({
      'string.empty': 'MPIN is required',
      'string.pattern.base': 'MPIN must be exactly 5 digits'
    }),
  
  confirmMpin: Joi.string()
    .trim()
    .valid(Joi.ref('mpin'))
    .required()
    .messages({
      'any.only': 'MPIN and confirm MPIN do not match',
      'string.empty': 'Confirm MPIN is required'
    })
});

// UPDATE PASSWORD Schema
const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Current password is required'
    }),
  
  password: Joi.string()
    .trim()
    .min(6)
    .max(50)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 50 characters'
    }),
  
  confirmPassword: Joi.string()
    .trim()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Password and confirm password do not match',
      'string.empty': 'Confirm password is required'
    })
});

// EMAIL OTP Schema
const emailOtpSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    })
});

// VERIFY EMAIL OTP Schema
const verifyEmailOtpSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  otp: Joi.string()
    .trim()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    })
});

// MOBILE OTP Schema
const mobileOtpSchema = Joi.object({
  mobile: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .required()
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must be in format +91XXXXXXXXXX'
    })
});

// VERIFY MOBILE OTP Schema
const verifyMobileOtpSchema = Joi.object({
  mobile: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .required()
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must be in format +91XXXXXXXXXX'
    }),
  
  otp: Joi.string()
    .trim()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    })
});

// RESET PASSWORD Schema
const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  otp: Joi.string()
    .trim()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    }),
  
  newPassword: Joi.string()
    .trim()
    .min(6)
    .max(50)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 50 characters'
    }),
  
  confirmNewPassword: Joi.string()
    .trim()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'New password and confirm password do not match',
      'string.empty': 'Confirm new password is required'
    })
});

// AADHAAR Schema
const aadhaarSchema = Joi.object({
  aadhaarId: Joi.string()
    .trim()
    .pattern(aadhaarRegex)
    .required()
    .messages({
      'string.empty': 'Aadhaar ID is required',
      'string.pattern.base': 'Aadhaar ID must be exactly 12 digits'
    })
});

// UPDATE PROFILE Schema
const updateProfileSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name cannot exceed 100 characters'
    }),
  
  user_name: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
    }),
  
  email: Joi.string()
    .trim()
    .email()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  phone: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .messages({
      'string.pattern.base': 'Phone number must be in format +91XXXXXXXXXX'
    })
});

// FORGOT PASSWORD Schema
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    })
});

// VERIFY EMAIL OTP FOR TRUE Schema
const verifyEmailOtpForTrueSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  otp: Joi.string()
    .trim()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    })
});

// VERIFY PHONE OTP FOR TRUE Schema
const verifyPhoneOtpForTrueSchema = Joi.object({
  mobile: Joi.string()
    .trim()
    .pattern(phoneRegex)
    .required()
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must be in format +91XXXXXXXXXX'
    }),
  
  otp: Joi.string()
    .trim()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be exactly 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    })
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
  updateProfileSchema,
  forgotPasswordSchema,
  verifyEmailOtpForTrueSchema,
  verifyPhoneOtpForTrueSchema
};