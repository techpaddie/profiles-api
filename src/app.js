const express = require("express");
const profilesRouter = require("./routes/profiles");
const { AppError, ExternalApiError } = require("./utils/errors");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.use("/api/profiles", profilesRouter);

app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ExternalApiError) {
    return res.status(502).json({
      status: "error",
      message: `${error.api} returned an invalid response`
    });
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      return res.status(500).json({
        status: "error",
        message: "Internal server error"
      });
    }

    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

module.exports = app;
