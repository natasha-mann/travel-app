const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const countryName = urlParams.get("country");
  return countryName;
};

// local storage for fav
const addFavourite = () => {
  const flagUrl = $("#flag-image").attr("src");
  const countryName = $("#country-name").text();

  const countryObj = { flag: flagUrl, country: countryName };

  const favCountryList = JSON.parse(localStorage.getItem("favourites"));
  favCountryList.push(countryObj);
  localStorage.setItem("favourites", JSON.stringify(favCountryList));
};

//function to build URL for REST countries to get data for country card
const createCountryCardUrl = (countryName) =>
  `https://restcountries.eu/rest/v2/name/${countryName}`;

//function to build URL for REST countries to get data for country card
const createPlacesCardUrl = (data, apiKey) =>
  `https://api.opentripmap.com/0.1/en/places/geoname?apikey=${apiKey}&name=${data.capital}`;

//function to build URL for REST countries to get data for country card
const createListItemsUrl = (data, apiKey, offset, pageLength) =>
  `https://api.opentripmap.com/0.1/en/places/radius?apikey=${apiKey}&radius=1000&limit=${pageLength}&offset=${offset}&lon=${data.lon}&lat=${data.lat}&rate=2&format=json`;

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
  <div class="ui bottom attached button" id="addFavBtn">
    <i class="heart icon"></i>
    Add to Favourites
  </div>
</div>`;
  $("#country-card").empty();
  $("#country-card").append(countryCard);
  $("#addFavBtn").click(addFavourite);
};

const renderPlacesCard = (countryCardData, listItemData, apiKey) => {
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
const getSelectedPlaceData = (data) => {
  if (data.wikipedia_extracts) {
    return {
      photo: data.preview.source,
      link: data.otm,
      description: data.wikipedia_extracts.text,
    };
  } else {
    return {
      photo: data.preview.source,
      link: data.otm,
    };
  }
};

// render photo and description of selected place on click of list item
const renderPlacesPhoto = (selectedPlaceData) => {
  $("#places-image-container").empty();
  $("#places-content").empty();
  $("#places-link").empty();

  $("#places-image-container").append(
    `<img class="ui centered image place-image" src="${selectedPlaceData.photo}"/>`
  );
  if (selectedPlaceData.description) {
    $("#places-content").text(`${selectedPlaceData.description}`);
  } else {
    $("#places-content").text("Click below to find out more!");
  }

  $("#places-link").append(`
  <a href="${selectedPlaceData.link}"<button class="ui button">Learn more</button></a>
  `);
};

//currency Input
const renderCurrencyCard = () => {
  const currencyCard = `
<div class="ui segments">
  <div class="ui segment card-header">
    <div class="header center aligned card-title">Currency Converter</div>
  </div>
  <div class="ui segment">
    <div class="ui form">
      <h3>The currency in Spain is Euro</h3>
      <div class="field">
        <label id="currency">Euro</label>
        <input type="number" name="" />
      </div>
      <div class="field">
        <select class="ui fluid dropdown">
          <option value="">Select a Currency</option>
          <option value="AL">Alabama</option>
        </select>
      </div>
      <div class="field">
        <input type="number" name="" placeholder="rate" />
      </div>
    </div>
  </div>
</div>`;
  $("#currency-container").empty();
  $("#currency-container").append(currencyCard);
};

//health and vaccines
const renderHealthCard = () => {
  const healthCard = `<div class="ui segments">
  <div class="ui segment card-header">
    <div class="header center aligned card-title">
      Health & Vaccines for spain
    </div>
  </div>
  <div class="ui segment">
    <p>some text here</p>
  </div>
</div>`;
  $("#health-container").empty();
  $("#health-container").append(healthCard);
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
    let offset = 0;
    const pageLength = 5;
    const urlForListItems = createListItemsUrl(
      placesData,
      apiKey,
      offset,
      pageLength
    );
    const listData = await fetchData(urlForListItems);
    const listItemData = await getListItemData(listData);

    renderCountryCard(countryCardData);
    renderWelcomeCard(countryCardData);
    renderPlacesCard(countryCardData, listItemData, apiKey);
    renderCurrencyCard();
    renderHealthCard();
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
  console.log(countryName);

  if (countryName) {
    renderAllData(countryName);
  }
};

$("#nav-form").on("submit", onSubmit);
$(document).ready(onReady);