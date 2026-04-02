// middleware/validate.middleware.js

const ApiError = require("../utils/ApiError");

module.exports = ({ body = [], fileFields = [] }) => {
  return (req, res, next) => {
    const missingFields = [];

    // 🔹 Check body fields
    for (const field of body) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        missingFields.push(field);
      }
    }

    // 🔹 Check file fields (multer)
    for (const field of fileFields) {
      const fileExists =
        (req.file && field === "file") || // single upload
        (req.files && req.files[field]);  // multiple / named fields

      if (!fileExists) {
        missingFields.push(field);
      }
    }

    // 🔥 If anything missing → throw error
    if (missingFields.length > 0) {
      return next(
        new ApiError(400, "Missing required fields", missingFields)
      );
    }

    next();
  };
};