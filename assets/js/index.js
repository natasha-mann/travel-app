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
      if (event.target.id === "start-form") {
        // remove search container and append search results container
        removeSearchAndAppendMain();
      }
    }
  }
};

$("#start-form").on("submit", onSubmit);
