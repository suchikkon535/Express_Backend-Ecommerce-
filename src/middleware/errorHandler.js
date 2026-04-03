const ApiError = require("../utils/apiError");

module.exports = (err, req, res, next) => {
  console.error(err);

  // Handle known errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle unknown errors safely
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};