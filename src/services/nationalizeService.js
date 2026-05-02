const axios = require("axios");
const { ExternalApiError } = require("../utils/errors");

async function fetchNationalize(name) {
  let data;
  try {
    const response = await axios.get("https://api.nationalize.io", {
      params: { name },
      timeout: 5000
    });
    data = response.data;
  } catch (error) {
    throw new ExternalApiError("Nationalize");
  }

  if (!data || !Array.isArray(data.country) || data.country.length === 0) {
    throw new ExternalApiError("Nationalize");
  }

  const validCountries = data.country.filter(
    (country) =>
      country &&
      typeof country.country_id === "string" &&
      typeof country.probability === "number"
  );

  if (validCountries.length === 0) {
    throw new ExternalApiError("Nationalize");
  }

  return {
    ...data,
    country: validCountries
  };
}

module.exports = { fetchNationalize };
