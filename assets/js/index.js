const RESULTS_URL = "./results.html?country=";

// set empty array in local storage if not present
const initialiseLocalStorage = () => {
  const localStorageData = localStorage.getItem("favourites");
  if (!localStorageData) {
    localStorage.setItem("favourites", JSON.stringify([]));
  }
};

// function called on submit of search form
const handleSearch = (event) => {
  event.preventDefault();

  const countryName = $("#search-bar").val();

  if (countryName) {
    window.location.href = `${RESULTS_URL}${countryName}`;
  }
};

// async await - function to fetch data from api (taking in a url) and returns the data
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
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
