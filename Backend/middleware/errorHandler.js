const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || constants.SERVER_ERROR;

  res.status(statusCode).json({
    title: getErrorTitle(statusCode),
    message: err.message,
    stackTrace: err.stack,
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
      return "No error, all good!";
  }
};

module.exports = errorHandler;
