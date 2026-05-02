const axios = require("axios");
const { ExternalApiError } = require("../utils/errors");

async function fetchAgify(name) {
  let data;
  try {
    const response = await axios.get("https://api.agify.io", {
      params: { name },
      timeout: 5000
    });
    data = response.data;
  } catch (error) {
    throw new ExternalApiError("Agify");
  }

  if (!data || typeof data.age !== "number") {
    throw new ExternalApiError("Agify");
  }

  return data;
}

module.exports = { fetchAgify };
