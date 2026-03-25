const passwordHasher = require("../middlewares/passwordHasher");
const User = require("../models/user_model");
const bcrypt = require("bcrypt")
const jwttoken = require("../helpers/jsonwebtoken")
const { validateInput, passwordValidator,phoneValidator } = require("../middlewares/inputValidator");



class AuthService {
    async register(data) {
        try {
            // hahs password
            data.password = await passwordHasher.hash(data.password);
            // create user
            const user = await User.create(data);

            return {
              sucess:true,
              data:user
            };

        } catch (error) {
             //Handle duplicate key error (MongoDB)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];

            return {
                success: false,
                message: `${field} already exists`
            };
        }
         return {
            success: false,
            message: "Something went wrong while registering user"
        };
        }
    }
   async login(data) {
    try {

        // Find user by email
        const user = await User.findOne({ email: data.email });

        if (!user) {
            throw new Error("User not found");
        }

        // Compare password with stored hash  password
        const isMatch = await bcrypt.compare(data.password, user.password);
        console.log(isMatch)

        if (!isMatch) {
            throw new Error("Invalid password");
        }
        console.log(user);
         const token = await jwttoken.createToken(user);
         console.log(token);
        // Login success
        return {user,token};

    } catch (error) {
        throw error;
    }
}

async MpinLogin(phone, mpin) {
  try {
    //  Required checks
    if (!phone) {
      throw new Error("Phone number is required");
    }

    if (!mpin) {
      throw new Error("MPIN is required");
    }

    //  Normalize phone
    phone = phone.trim();

    //  Validate phone
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

    //  Ensure mpin exists
    if (!user.mpin) {
      throw new Error("MPIN not set for this user");
    }

    //  Compare mpin
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

    //  Generate jwt token
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