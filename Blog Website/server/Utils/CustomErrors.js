class CustomErrors extends Error {
  constructor(message, statusCode) {
    super(message);
    (this.statusCode = statusCode),
      (this.message = message),
      (this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error");
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = CustomErrors;
