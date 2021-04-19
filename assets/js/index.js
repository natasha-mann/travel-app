// set empty array in local storage if not present
const initialiseLocalStorage = () => {
  const localStorageData = localStorage.getItem("favourites");
  if (!localStorageData) {
    localStorage.setItem("favourites", JSON.stringify([]));
  }
};

// function called on submit of search form
const onSubmit = (event) => {
  event.preventDefault();

  const countryName = $("#search-bar").val();

  initialiseLocalStorage();

  if (countryName) {
    window.location.href = `./results.html?country=${countryName}`;
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

const getCountryNames = (item) => item.name;

const getRandomCountry = async () => {
  const allCountryData = await fetchData(
    "https://restcountries.eu/rest/v2/all"
  );
  const allCountryNames = allCountryData.map(getCountryNames);
  const randomCountry =
    allCountryNames[Math.floor(Math.random() * allCountryNames.length - 1)];
  return randomCountry;
};

const randomSearch = async (event) => {
  event.preventDefault();
  const randomCountry = await getRandomCountry();
  window.location.href = `./results.html?country=${randomCountry}`;
};

$("#start-form").on("submit", onSubmit);
$("#random-form").on("submit", randomSearch);
