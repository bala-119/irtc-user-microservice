const passwordHasher = require("../middlewares/passwordHasher");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwttoken = require("../helpers/jsonwebtoken");
const { phoneValidator } = require("../middlewares/inputValidator");
const { registerSchema, loginSchema } = require("../validator/user_validatator");

// Validation helper
const validate = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

class AuthService {
  async register(data) {
    try {
      // Validate input
      const validatedData = validate(registerSchema, data);
      
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: validatedData.email },
          { phone: validatedData.phone },
          { user_name: validatedData.user_name }
        ]
      });
      
      if (existingUser) {
        if (existingUser.email === validatedData.email) {
          throw new Error("Email already registered");
        }
        if (existingUser.phone === validatedData.phone) {
          throw new Error("Phone number already registered");
        }
        if (existingUser.user_name === validatedData.user_name) {
          throw new Error("Username already taken");
        }
      }
      
      // hash password
      validatedData.password = await passwordHasher.hash(validatedData.password);
      
      // create user
      const user = await User.create(validatedData);

      return {
        success: true,
        data: user
      };

    } catch (error) {
      // Handle duplicate key error (MongoDB)
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return {
          success: false,
          message: `${field} already exists`
        };
      }
      
      return {
        success: false,
        message: error.message || "Something went wrong while registering user"
      };
    }
  }

  async login(data) {
    try {
      // Validate input
      const validatedData = validate(loginSchema, data);
      
      // Find user by email
      const user = await User.findOne({ email: validatedData.email });

      if (!user) {
        throw new Error("User not found");
      }

      // Compare password with stored hash password
      const isMatch = await bcrypt.compare(validatedData.password, user.password);
      console.log(isMatch);

      if (!isMatch) {
        throw new Error("Invalid password");
      }
      
      console.log(user);
      const token = await jwttoken.createToken(user);
      console.log(token);
      
      // Login success
      return { user, token };

    } catch (error) {
      throw error;
    }
  }

  async MpinLogin(phone, mpin) {
    try {
      // Required checks
      if (!phone) {
        throw new Error("Phone number is required");
      }

      if (!mpin) {
        throw new Error("MPIN is required");
      }

      // Normalize phone
      phone = phone.trim();

      // Validate phone
      const { isValid, errors } = phoneValidator(phone);

      if (!isValid) {
        return {
          success: false,
          errors
        };
      }

      // Find user
      const user = await User.findOne({ phone });

      if (!user) {
        throw new Error("User not found with this phone number");
      }

      // Ensure mpin exists
      if (!user.mpin) {
        throw new Error("MPIN not set for this user");
      }

      // Compare mpin
      const isMatch = await bcrypt.compare(mpin, user.mpin);

      if (!isMatch) {
        throw new Error("Invalid MPIN");
      }

      const safeUser = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      };

      // Generate jwt token
      const token = await jwttoken.createToken(user);

      return {
        success: true,
        message: "Login successful",
        user: safeUser,
        token
      };

    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong"
      };
    }
  }
}

module.exports = new AuthService();