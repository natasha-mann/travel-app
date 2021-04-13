//function to build URL for REST countries to get data for country card
const createCountryCardUrl = (countryName) => {
  return `https://restcountries.eu/rest/v2/name/${countryName}`;
};

// function to remove search container and append main sections
const removeSearchAndAppendMain = async () => {
  //remove search container
  $("#search-container").remove();

  // add search bar to navbar
  $("#navbar").prepend(`<div class="item">
  <div class="ui fluid search">
    <div class="ui icon input" id="search-nav"><input type="text" placeholder="Enter country..." id="search-bar" />
    <i class="search icon"></i></div>
  </div>
`);
};

// function called on submit of search form
const onSubmit = async (event) => {
  event.preventDefault();

  const countryName = $("#search-bar").val();
  console.log(countryName);

  // create URL + fetch data for country card
  const urlForCountryCard = createCountryCardUrl(countryName);

  // remove search container and append search results container
  removeSearchAndAppendMain();
};

$("#start-form").on("submit", onSubmit);
