const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode;

  // If no status was set before error occurred, default to 500
  if (statusCode === 200) {
    statusCode = constants.SERVER_ERROR;
  }

  //MONGOOSE VALIDATION ERROR

  if (err.name === "ValidationError") {
    statusCode = constants.VALIDATION_ERROR;

    const messages = Object.values(err.errors).map((val) => val.message);

    return res.status(statusCode).json({
      title: "Validation Failed",
      message: messages.join(", "),
      stackTrace: err.stack,
      //to review
      //process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  /**
   * MONGOOSE CAST ERROR (invalid ObjectId)
   */
  if (err.name === "CastError") {
    statusCode = constants.VALIDATION_ERROR;

    return res.status(statusCode).json({
      title: "Invalid ID",
      message: `Invalid ${err.path}: ${err.value}`,
      stackTrace: err.stack,
      //to review
      //process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  /**
   * DUPLICATE KEY ERROR (unique index violation)
   */
  if (err.code === 11000) {
    statusCode = constants.VALIDATION_ERROR;

    const field = Object.keys(err.keyValue)[0];

    return res.status(statusCode).json({
      title: "Duplicate Field",
      message: `${field} already exists`,
      stackTrace: err.stack,
      //to review
      //process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  // Default fallback
  res.status(statusCode).json({
    title: getErrorTitle(statusCode),
    message: err.message,
    stackTrace: err.stack,
    //to review
    //process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

const getErrorTitle = (statusCode) => {
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      return "Validation Failed";
    case constants.NOT_FOUND:
      return "Not Found";
    case constants.UNAUTHORIZED:
      return "Unauthorized";
    case constants.FORBIDDEN:
      return "Forbidden";
    case constants.SERVER_ERROR:
      return "Server Error";
    default:
      return "Error";
  }
};

module.exports = errorHandler;
