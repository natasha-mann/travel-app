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
    <img src="${data.flag}" />
  </div>
  <div class="content">
    <a class="header">${data.name}</a>
    <div class="description">Capital: ${data.capital}</div>
    <div class="description">Language: ${data.language}</div>
    <div class="description">Currency: ${data.currency}</div>
  </div>
  <div class="ui bottom attached button">
    <i class="heart icon"></i>
    Add to Favourites
  </div>
</div>`;
  $("#country-card").empty();
  $("#country-card").append(countryCard);
};

const renderPlacesCard = () => {
  const placesCard = `<div class="ui segment">
  <div class="ui center aligned segment card-header">
    <h3 class="card-title">Places to see in Madrid</h3>
  </div>
  <div class="ui celled selection list" id ="places-list">
    <div class="item">
      <div class="content">Description</div>
    </div>
    <div class="item">
      <div class="content">Description</div>
    </div>
    <div class="item">
      <div class="content">Description</div>
    </div>
    <div class="item">
      <div class="content">Description</div>
    </div>
  </div>
  <div class="ui fluid button" id ="places-button">Show more</div>
</div>

<div class="ui placeholder segment">
  <div class="ui fluid card">
    <div class="image" id ="places-image"></div>
    <div class="content" id ="places-content"></div>
  </div>
</div> `;
  $("#places-container").empty();
  $("#places-container").append(placesCard);
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

//function to build URL for REST countries to get data for country card
const createCountryCardUrl = (countryName) =>
  `https://restcountries.eu/rest/v2/name/${countryName}`;

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

//function to build URL for REST countries to get data for country card
const createPlacesCardUrl = (data, apiKey) =>
  `https://api.opentripmap.com/0.1/en/places/geoname?apikey=${apiKey}&name=${data.capital}`;
// function to remove search container and append main sections
const removeSearchAndAppendMain = async () => {
  //remove search container
  $("#search-container").remove();

  // add search bar to navbar
  $("#navbar").prepend(`
  <div class="item">
    <form id="nav-form">
      <div class="field">
        <div class="ui fluid search">
          <div class="ui icon input" id="search-nav">
            <input
              type="text"
              placeholder="Enter country..."
              id="search-bar"
            />
            <button type="submit">
            <i class="search icon"></i>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
`);
  $("#nav-form").on("submit", onSubmit);

  // add main grid
  $("#main-container").append(`
  <div class="ui two column stackable divided grid">
    <div class="stretched row">
      <div class="sixteen wide mobile four wide tablet four wide computer column side-col">
            
        <!-- welcome container -->
        <div class="ui orange center aligned attached segment" id="welcome-card">
        </div>

        <!-- country container -->
        <div class="ui center aligned attached segment" id="country-card">
        </div>
      </div>

      <div class="sixteen wide mobile twelve wide tablet twelve wide computer column main-col">

        <!-- places container -->
        <div class="ui horizontal segments" id="places-container">
        </div>

        <div class="ui horizontal segments">
          <div class="ui compact segment" id="health-container"></div>
          <div class="ui segment" id="currency-container"></div>
        </div>
      </div>
            
    </div>
  </div>`);
};

// function called on submit of search form
const onSubmit = async (event) => {
  event.preventDefault();

  const countryName = $("#search-bar").val();

  if (countryName) {
    // create URL + fetch data for country card
    const urlForCountryCard = createCountryCardUrl(countryName);
    const restApiData = await fetchData(urlForCountryCard);
    if (Array.isArray(restApiData)) {
      const countryCardData = await getCountryCardData(restApiData);
      const apiKey = "5ae2e3f221c38a28845f05b6fac16143ca6a7e70223b17f1cc98d3e7";
      const urlForPlacesCard = createPlacesCardUrl(countryCardData, apiKey);
      console.log(urlForPlacesCard);
      if (event.target.id === "start-form") {
        // remove search container and append search results container
        removeSearchAndAppendMain();
      }
      renderCountryCard(countryCardData);
      renderWelcomeCard(countryCardData);
      renderPlacesCard();
      renderCurrencyCard();
      renderHealthCard();
    }
  }
};

$("#start-form").on("submit", onSubmit);
