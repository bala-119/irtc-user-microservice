const internalServerError = ({ req, res, status, err }) => {
    return res.status(status).json({
      status,
      message: err.message,
    });
  };
  
  module.exports = { internalServerError };
  