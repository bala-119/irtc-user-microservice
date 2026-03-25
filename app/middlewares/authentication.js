const jwt = require("jsonwebtoken");

const verifyToken = (type = ["ADMIN"]) =>
  async function (req, res, next) {
    try {
      if (
        req.headers["x-access-token"] ||
        req.headers["authorization"] ||
        req.headers["Authorization"]
      ) {
        let token =
          req.headers["x-access-token"] ||
          req.headers["authorization"] ||
          req.headers["Authorization"];
        token = token.replace("Bearer ", "");
        let decode, user;
        var userData = null;
        let userType = null;
        try {
          let id;
          decode = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
          if (decode) {
            id = decode?.id || decode?._id;
          }
          userData = await Admin.findOne({
            _id: id,
            //token: token,
          });
        } catch (error) {}
        if (userData) {
          if (!userData?.isActive) {
            return sendErrorResponse(
              req,
              res,
              statusCodes.HTTP_UNAUTHORIZED,
              messages.adminInActive,
              []
            );
          } else {
            req.user = userData;
            req.user.userType = userType;
            next();
          }
        } else {
          return sendErrorResponse(
            req,
            res,
            statusCodes.HTTP_UNAUTHORIZED,
            messages.tokenInvalid,
            []
          );
        }
      } else {
        return sendErrorResponse(
          req,
          res,
          statusCodes.HTTP_UNAUTHORIZED,
          messages.tokenEmpty,
          []
        );
      }
    } catch (error) {
      console.log(error);
      return sendErrorResponse(
        req,
        res,
        statusCodes.HTTP_UNAUTHORIZED,
        messages.tokenInvalid,
        []
      );
    }
  };
const verifyAdminRole = (roles, action) =>
  async function (req, res, next) {
    let isPermissionDenied = true;
    if (req.user && req.user.permissions) {
      if (req.user.permissions[roles]) {
        if (
          req.user.permissions[roles].indexOf(action.toString()) ||
          req.user.permissions[roles].indexOf("ALL")
        ) {
          isPermissionDenied = false;
        }
      }
    }
    if (req.user.userType == "AP") {
      isPermissionDenied = false;
    }
    if (isPermissionDenied) {
      return sendErrorResponse(
        req,
        res,
        statusCodes.HTTP_UNAUTHORIZED,
        messages.tokenInvalid,
        []
      );
    } else {
      next();
    }
  };

module.exports = { verifyAdminRole, verifyToken, validateSession };
