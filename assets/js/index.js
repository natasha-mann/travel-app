const RESULTS_URL = "./results.html?country=";

// function called on submit of search form
const handleSearch = (event) => {
  event.preventDefault();

  const countryName = $("#search-bar").val();

  if (countryName) {
    window.location.href = `${RESULTS_URL}${countryName}`;
  }
};

const getRandomCountry = async () => {
  const allCountryData = await fetchData(
    "https://restcountries.eu/rest/v2/all"
  );
  const allCountryNames = allCountryData.map((item) => item.name);
  const randomCountry =
    allCountryNames[Math.floor(Math.random() * allCountryNames.length - 1)];
  return randomCountry;
};

const handleRandomSearch = async (event) => {
  event.preventDefault();

  const randomCountry = await getRandomCountry();

  window.location.href = `${RESULTS_URL}${randomCountry}`;
};

const initialisePage = () => {
  initialiseLocalStorage();
};

$("#start-form").on("submit", handleSearch);
$("#random-form").on("submit", handleRandomSearch);
$(document).ready(initialisePage);
