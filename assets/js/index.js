const RESULTS_URL = "./results.html?country=";

// function called on submit of search form
const handleSearch = (event) => {
  event.preventDefault();

  const countryName = $("#search-bar").val();

  if (countryName) {
    addLastSearch();
    window.location.href = `${RESULTS_URL}${countryName}`;
  } else {
    $("#search-bar").addClass("error");
  }
};

const renderRecentSearches = (searches) => {
  $("#popup-cards").empty();

  if (searches.length === 0) {
    $("#popup-cards").removeClass("one two three column").addClass("one column")
      .append(`<div class="column">
      <h4 class="ui header">No recent searches!</h4>
    </div>`);
  } else if (searches.length === 1) {
    $("#popup-cards")
      .removeClass("one two three column")
      .addClass("one column");
    searches.forEach(renderRecentCard);
  } else if (searches.length === 2) {
    $("#popup-cards")
      .removeClass("one two three column")
      .addClass("two column");
    searches.forEach(renderRecentCard);
  } else if (searches.length === 3) {
    $("#popup-cards")
      .removeClass("one two three column")
      .addClass("three column");
    searches.forEach(renderRecentCard);
  }
};

const renderRecentCard = (item) => {
  const country = item.country;
  const countryWithCapitalLetter =
    country.charAt(0).toUpperCase() + country.substr(1).toLowerCase();
  $("#popup-cards").append(`
  <div class="column">
              <h4 class="ui header">${countryWithCapitalLetter}</h4>
              <div class="ui button" id="${country}-btn">Search</div>
            </div>
  `);
  const search = () => {
    window.location.href = `${RESULTS_URL}${country}`;
  };
  $(`#${country}-btn`).click(search);
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

  const searches = getFromLocalStorage("searches");
  renderRecentSearches(searches);
};

$(".popup-btn").popup({
  on: "click",
});

$("#start-form").on("submit", handleSearch);
$("#random-form").on("submit", handleRandomSearch);
$(document).ready(initialisePage);
