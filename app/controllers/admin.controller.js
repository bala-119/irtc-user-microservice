const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../response/response");


const {
  adminLoginService,

} = require("../services/admin.services");

// admin related api's

const adminLogin = async (req, res) => {
  const params = req.body;
  const result = await adminLoginService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

module.exports = {
  adminLogin,
};
