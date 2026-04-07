const jwt = require("jsonwebtoken")

class JsonwebTokenHandler{

    
    createToken(user) {
        try {

            const payload = {
            
                email: user.email,
                id : user._id,
                phone : user.phone,
                role : user.role,
                user_name : user.user_name,
                email_verified : user.email_verified,
                aadhaarId_verified : user.aadhaarId_verified,
                phone_verified : user.phone_verified,
                fullName : user.fullName,
                mpin : user.mpin   

            };

            const token =  jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return token;

        } catch (error) {
            throw error;
        }
    }
    
    verifyToken(token){
        try{
            const decoded = jwt.verify(token,
                process.env.JWT_SECRET
            );
            return decoded;
        }catch(error)
        {
            throw error;
        }
    }

}


    module.exports = new JsonwebTokenHandler();


    

