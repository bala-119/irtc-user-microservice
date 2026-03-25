const jwt = require('jsonwebtoken');

module.exports = {
    generateAccessToken: function (data) {
        return jwt.sign(data, process.env.JWT_ADMIN_SECRET, { expiresIn: "274d" });
    },

}