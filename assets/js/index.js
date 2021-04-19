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
    window.location.href = `/results.html?country=${countryName}`;
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
  console.log(allCountryData);
};

const randomSearch = async (event) => {
  event.preventDefault();
  const randomCountry = await getRandomCountry();

  let index = Math.floor(Math.random() * countries.length - 1);
  let countryName = countries[index];
  window.location.href = `/results.html?country=${countryName}`;
};

$("#start-form").on("submit", onSubmit);
$("#random-form").on("submit", randomSearch);
