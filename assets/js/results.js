// global variables
let offset = 0;
const pageLength = 5;
let apiVaccines = null;

const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const countryName = urlParams.get("country");
  return countryName;
};

//function to build URL for REST countries to get data for country card
const createCountryCardUrl = (countryName) =>
  `https://restcountries.eu/rest/v2/name/${countryName}`;

//function to build URL for REST countries to get data for country card
const createPlacesCardUrl = (data, apiKey) =>
  `https://api.opentripmap.com/0.1/en/places/geoname?apikey=${apiKey}&name=${data.capital}`;

//function to build URL for REST countries to get data for country card
const createListItemsUrl = (data, apiKey, offset, pageLength) =>
  `https://api.opentripmap.com/0.1/en/places/radius?apikey=${apiKey}&radius=10000&limit=${pageLength}&offset=${offset}&lon=${data.lon}&lat=${data.lat}&rate=2&format=json`;

//function to build URL for travel briefing Api to get data for Health and Vaccines and Currency Card
const createTravelBriefingUrl = (countryName) =>
  `https://travelbriefing.org/${countryName}?format=json`;

// extract needed data from REST countries api call to construct country card
const getCountryCardData = async (restApiData) => {
  const data = restApiData[0];
  return {
    name: await data.name,
    flag: await data.flag,
    capital: await data.capital,
    language: await data.languages[0].name,
    currency: await data.currencies[0].name,
  };
};

const getEachData = (item) => {
  return {
    name: item.name,
    type: item.kinds,
    xid: item.xid,
  };
};

// extract needed data from open trip map api call to construct places list
const getListItemData = async (data) => {
  return data.map(getEachData);
};

// extract needed data from Travel Briefing Api call to construct Health and Vaccines and Currency Card
const getTravelBriefingData = async (travelBriefingApiData) => {
  return {
    vaccines: travelBriefingApiData.vaccinations,
    currency: travelBriefingApiData.currency,
  };
};

// welcome card
const renderWelcomeCard = (data) => {
  const welcomeCard = `<div class="ui message">
  <div class="header">Welcome!</div>
  <p>
    We hope you find the information about ${data.name} useful! Take a
    look around and make sure to add your countries to your favourites.
  </p>
</div>`;
  $("#welcome-card").empty();
  $("#welcome-card").append(welcomeCard);
};

// country card
const renderCountryCard = (data) => {
  const countryCard = `<div class="ui centered card">
  <div class="image">
    <img src="${data.flag}" id="flag-image" />
  </div>
  <div class="content">
    <a class="header" id="country-name">${data.name}</a>
    <div class="description">Capital: ${data.capital}</div>
    <div class="description">Language: ${data.language}</div>
    <div class="description">Currency: ${data.currency}</div>
  </div>
  <div class="ui bottom attached button teal" id="addFavBtn">
    <i class="heart icon"></i>
    Add to Favourites
  </div>
</div>`;
  $("#country-card").empty();
  $("#country-card").append(countryCard);

  const favCountryList = JSON.parse(localStorage.getItem("favourites"));

  if (favCountryList.some((item) => item.country === data.name)) {
    $("#addFavBtn")
      .text("Remove From Favourites")
      .removeClass("teal")
      .addClass("red")
      .attr("id", "removeFavBtn");
    $("#removeFavBtn").click(removeFavourites);
  } else {
    $("#addFavBtn")
      .text("Add to Favourites")
      .removeClass("red")
      .addClass("teal");
    $("#addFavBtn").click(addFavourite);
  }
};

const removeFavourites = () => {
  const countryName = $("#country-name").text();
  const favourites = JSON.parse(localStorage.getItem("favourites"));

  const filteredFavourites = favourites.filter(
    (item) => item.country !== countryName
  );
  localStorage.setItem("favourites", JSON.stringify(filteredFavourites));

  const newFavCountryList = JSON.parse(localStorage.getItem("favourites"));
  if (
    newFavCountryList.some((item) => item.country !== countryName) ||
    newFavCountryList.length === 0
  ) {
    $("#removeFavBtn")
      .text("Add to Favourites")
      .removeClass("red")
      .addClass("teal")
      .attr("id", "addFavBtn");
    $("#addFavBtn").click(addFavourite);
  }
};

// local storage for fav
const addFavourite = () => {
  const flagUrl = $("#flag-image").attr("src");
  const countryName = $("#country-name").text();

  const countryObj = { flag: flagUrl, country: countryName };

  const favCountryList = JSON.parse(localStorage.getItem("favourites"));
  favCountryList.push(countryObj);
  localStorage.setItem("favourites", JSON.stringify(favCountryList));

  const newFavCountryList = JSON.parse(localStorage.getItem("favourites"));

  if (newFavCountryList.some((item) => item.country === countryName)) {
    $("#addFavBtn")
      .text("Remove From Favourites")
      .removeClass("teal")
      .addClass("red")
      .attr("id", "removeFavBtn");
    $("#removeFavBtn").click(removeFavourites);
  }
};

const renderPlacesCard = (
  countryCardData,
  listItemData,
  apiKey,
  placesData
) => {
  const placesCard = `<div class="ui segment places-aside">
  <div class="ui center aligned segment card-header">
    <h3 class="card-title">Places to see in ${countryCardData.capital}</h3>
  </div>
  <div class="ui celled selection list" id ="places-list">
  </div>
  <div class="ui fluid button" id ="places-button">Show more</div>
</div>

<div class="ui placeholder segment places-main">
  <div class="ui fluid card places-card">
    <div class="image" id ="places-image-container"></div>
    <div class="center aligned content" id ="places-content"></div>
    <div id="places-link"> </div>
  </div>
</div> `;
  $("#places-container").empty();
  $("#places-container").append(placesCard);

  listItemData.forEach(buildListItem);

  $("#places-list").on("click", { apiKey }, onListClick);

  const showMorePlaces = async () => {
    offset += pageLength;

    const newListUrl = createListItemsUrl(
      placesData,
      apiKey,
      offset,
      pageLength
    );
    const newListData = await fetchData(newListUrl);
    const newListItemData = await getListItemData(newListData);
    $("#places-list").empty();
    newListItemData.forEach(buildListItem);
  };

  $("#places-button").on("click", showMorePlaces);
};

// build list item for places container
const buildListItem = (item) => {
  $("#places-list").append(`
  <div class="item">
    <div class="content" data-xid="${item.xid}">${item.name}</div>
  </div>
  `);
};

// on click of list item get data from api for places image and description and render
const onListClick = async (event) => {
  const apiKey = event.data.apiKey;
  const selectedPlace = event.target;
  const selectedPlaceXid = $(selectedPlace).data("xid");
  const xidUrl = `https://api.opentripmap.com/0.1/en/places/xid/${selectedPlaceXid}?apikey=${apiKey}`;
  const selectedPlaceApiData = await fetchData(xidUrl);
  const selectedPlaceData = getSelectedPlaceData(selectedPlaceApiData);
  renderPlacesPhoto(selectedPlaceData);
};

// extract data needed from api call to use for photo and description on places card

const getValueFromNestedObject = (
  nestedObj = {},
  tree = [],
  defaultValue = ""
) =>
  Array.isArray(tree)
    ? tree.reduce(
        (obj, key) => (obj && obj[key] ? obj[key] : defaultValue),
        nestedObj
      )
    : {};

const getSelectedPlaceData = (data) => {
  return {
    photo: getValueFromNestedObject(
      data,
      ["preview", "source"],
      "https://www.aepint.nl/wp-content/uploads/2014/12/No_image_available.jpg"
    ),
    link: data.otm,
    description: getValueFromNestedObject(
      data,
      ["wikipedia_extracts", "text"],
      "Sorry we have no information!"
    ),
  };
};

// render photo and description of selected place on click of list item
const renderPlacesPhoto = (selectedPlaceData) => {
  $("#places-image-container").empty();
  $("#places-content").empty();
  $("#places-link").empty();

  $("#places-image-container").append(
    `<img class="ui centered image place-image" src="${selectedPlaceData.photo}"/>`
  );

  $("#places-content").text(`${selectedPlaceData.description}`);

  if (selectedPlaceData.link) {
    $("#places-link").append(`
<a href="${selectedPlaceData.link}"<button class="ui button">Learn more</button></a>
`);
  }
};

//currency Input
const renderCurrencyCard = (countryCardData, travelBriefingData) => {
  const currencyData = travelBriefingData.currency;
  const currencyCard = `
<div class="ui segments">
  <div class="ui segment card-header">
    <h3 class="ui header center aligned card-title">Currency Converter</h3>
  </div>
  <div class="ui segment">
    <div class="ui form">
      <h3>The currency in ${countryCardData.name} is ${currencyData.name}</h3>
      <div class="field" >
        <label id="currency"> ${currencyData.name}</label>
        <input type="number" id="currency-input" />
      </div>
      <div class="field">
        <select class="ui fluid dropdown" id="currency-list">
          <option value="">Select a Currency</option>
        </select>
      </div>
      <div class="field">
      <label id="currency-label"> </label>
        <input id="currency-rate" type="number" name="" readonly=""/>
      </div>
    </div>
  </div>
</div>`;
  $("#currency-container").empty();
  $("#currency-container").append(currencyCard);

  const currencyListArray = currencyData.compare;
  currencyListArray.forEach(buildCurrencyList);

  $("#currency-input").val(1);
  let conversionRate = 1 / currencyData.rate;

  const convertCurrency = () => {
    $("#currency-input").val(1);
    const selectedOption = $("#currency-list").val();
    $("#currency-label").text(selectedOption);

    const selectedRate = $("#currency-list").find(":selected").data("rate");
    conversionRate = conversionRate * selectedRate;
    $("#currency-rate").val(conversionRate);
  };

  const multiplyValue = () => {
    const input = $("#currency-input").val();
    const output = input * conversionRate;
    $("#currency-rate").val(output);
  };

  multiplyValue();
  $("#currency-list").change(convertCurrency);
  $("#currency-input").keyup(multiplyValue);
};

const buildCurrencyList = (item) => {
  if (item.name === "US Dollar") {
    $("#currency-list").append(
      `<option selected id="currency-item" value="${item.name}" data-rate="${item.rate}">${item.name}</option>`
    );
  } else {
    $("#currency-list").append(
      `<option id="currency-item" value="${item.name}" data-rate="${item.rate}">${item.name}</option>`
    );
  }
};

//health and vaccines
const renderHealthCard = (countryCardData, travelBriefingData) => {
  const healthCard = `<div class="ui segments">
  <div class="ui segment card-header">
    <h3 class="ui header center aligned card-title">
      Health & Vaccines for ${countryCardData.name}
    </h3>
  </div>
  <div class="ui segment">
  <div class="ui middle aligned selection list" id= "vaccines-list">
  </div>
  </div>
</div>`;

  $("#health-container").empty();
  const vaccines = travelBriefingData.vaccines;
  $("#health-container").append(healthCard);
  vaccines.forEach(addVaccineListItem);
};

const renderModal = (event) => {
  if (apiVaccines) {
    const vaccine = event.currentTarget;
    const vaccineName = $(vaccine).data("name");
    const vaccineData = apiVaccines;
    const modalVaccineData = vaccineData.find(
      (vaccine) => vaccine.name === vaccineName
    );
    console.log(modalVaccineData.name);
    const modal = $(`<div class="ui modal">
    <i class="close icon"></i>
    <div class="header">
    Travel Information
    </div>
    <div class="image content">
      <div class="ui medium image">
        <img src="/assets/images/hospital.png">
      </div>
      <div class="description">
        <div class="ui header">${modalVaccineData.name}</div>
        <p>${modalVaccineData.message}</p>
      </div>
    </div>
    <div class="actions">
      <div class="ui teal deny button">
        Close
      </div>
    </div>
  </div>`);
    $(modal).modal("show");
  }
};

const addVaccineListItem = (item) => {
  $("#vaccines-list")
    .append(`<a class="item" id= "vaccine-name" data-name ="${item.name}">
  <i class="medkit icon"></i>
  <div class="content">
    <div class="header">${item.name}</div>
  </div>
</a>`);

  $(`#vaccine-name[data-name="${item.name}"]`).click(renderModal);
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

const renderAllData = async (countryName) => {
  // create URL + fetch data for country card
  const urlForCountryCard = createCountryCardUrl(countryName);
  const restApiData = await fetchData(urlForCountryCard);

  // if the data from API exists as an array
  if (Array.isArray(restApiData)) {
    const countryCardData = await getCountryCardData(restApiData);
    const apiKey = "5ae2e3f221c38a28845f05b6fac16143ca6a7e70223b17f1cc98d3e7";
    const urlForPlacesCard = createPlacesCardUrl(countryCardData, apiKey);
    const placesData = await fetchData(urlForPlacesCard);

    const urlForListItems = createListItemsUrl(
      placesData,
      apiKey,
      offset,
      pageLength
    );
    const listData = await fetchData(urlForListItems);
    const listItemData = await getListItemData(listData);

    const travelBriefingUrl = createTravelBriefingUrl(countryName);
    const travelBriefingApiData = await fetchData(travelBriefingUrl);
    const travelBriefingData = await getTravelBriefingData(
      travelBriefingApiData
    );
    apiVaccines = travelBriefingData.vaccines;

    renderCountryCard(countryCardData);
    renderWelcomeCard(countryCardData);
    renderPlacesCard(countryCardData, listItemData, apiKey, placesData);
    renderCurrencyCard(countryCardData, travelBriefingData);
    renderHealthCard(countryCardData, travelBriefingData);
  }
};

// function called on submit of search form
const onSubmit = (event) => {
  event.preventDefault();

  const countryName = $("#search-bar").val();

  if (countryName) {
    renderAllData(countryName);
  }
};

const onReady = () => {
  const countryName = getUrlParams();

  if (countryName) {
    renderAllData(countryName);
  }
};

$("#nav-form").on("submit", onSubmit);
$(document).ready(onReady);
