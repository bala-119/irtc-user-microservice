// error handler middleware
const errHandle = (err, req, res, next) => {
    console.log(err);
    let statusCode = 500;
    if (err && err.error) {
      statusCode = 400;
      let error = err.error.details.reduce((prev, curr) => {
        prev[curr.path[0]] = curr.message.replace(/"/g, "");
        return prev;
      }, {});
      let msg = Object.values(error).join(", ");
      err.message = msg;
    } else if (err && err.status) {
      statusCode = err.status;
    }
    res.status(statusCode).json({
      status: statusCode,
      message: err?.message || "Something went wrong",
    });
  };
  // export default errHandle
  module.exports = { errHandle };
  