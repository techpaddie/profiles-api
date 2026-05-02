const axios = require("axios");
const { ExternalApiError } = require("../utils/errors");

async function fetchGenderize(name) {
  let data;
  try {
    const response = await axios.get("https://api.genderize.io", {
      params: { name },
      timeout: 5000
    });
    data = response.data;
  } catch (error) {
    throw new ExternalApiError("Genderize");
  }

  if (
    !data ||
    typeof data.gender !== "string" ||
    typeof data.probability !== "number" ||
    typeof data.count !== "number" ||
    data.count === 0
  ) {
    throw new ExternalApiError("Genderize");
  }

  return data;
}

module.exports = { fetchGenderize };
