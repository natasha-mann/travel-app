const getFromLocalStorage = () => {
  const favourites = localStorage.getItem("favourites");
  if (favourites) {
    return JSON.parse(favourites);
  } else {
    return [];
  }
};

const renderFavCountryCard = (item) => {
  const favCountryCard = `<div class="ui centered card">
  <div class="image">
    <img src= "${item.flag}"/>
  </div>
  <div class="content ui grid col-4 center aligned">
    <div class="header">${item.country}</div>
  </div>
  <div class="ui bottom attached button">Remove from Favourites</div>
</div>`;
  $("#favourite-container").append(favCountryCard);
};

const renderFavouritesCards = (favourites) => {
  if (favourites.length === 0) {
    console.log("oh no theres no countries");
  } else {
    favourites.forEach(renderFavCountryCard);
  }
};

const onLoad = () => {
  const favourites = getFromLocalStorage();

  renderFavouritesCards(favourites);
};

$(document).ready(onLoad);
