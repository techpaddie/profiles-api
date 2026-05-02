function classifyAgeGroup(age) {
  if (age <= 12) return "child";
  if (age <= 19) return "teenager";
  if (age <= 59) return "adult";
  return "senior";
}

function getTopCountry(countryList) {
  return countryList.reduce((best, current) => {
    if (!best || current.probability > best.probability) {
      return current;
    }
    return best;
  }, null);
}

module.exports = { classifyAgeGroup, getTopCountry };
