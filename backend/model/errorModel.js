class AppError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status || 500;
    this.stack = process.env.NODE_ENV === "production" ? null : this.stack;
  }
}

module.exports = AppError;
