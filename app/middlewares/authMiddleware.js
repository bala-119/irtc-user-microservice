const jwtHandler = require("../helpers/jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwtHandler.verifyToken(token);

        req.user = decoded;

        next();

    } catch (error) {

        res.status(401).json({
            success: false,
            message: "Invalid token"
        });

    }
};


module.exports = authMiddleware;