const { AppError } = require("./errors");

function validateNameInput(name) {
  if (name === undefined || name === null) {
    throw new AppError("name is required", 400);
  }

  if (typeof name !== "string") {
    throw new AppError("name must be a string", 422);
  }

  if (name.trim() === "") {
    throw new AppError("name cannot be empty", 400);
  }
}

module.exports = { validateNameInput };
