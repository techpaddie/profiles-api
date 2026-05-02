class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ExternalApiError extends Error {
  constructor(api) {
    super(`${api} returned an invalid response`);
    this.api = api;
    this.statusCode = 502;
  }
}

module.exports = { AppError, ExternalApiError };
