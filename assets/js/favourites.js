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

const renderEmptyFavourites = () => {
  const emptyFavourites = `<div class="ui placeholder center aligned segment empty-favourites">
  <div class="ui icon header">
    <i class="heart icon"></i>
    You don't have any favourite countries yet! 
  </div>
  <div class="inline">
    <div class="ui primary button">   
    <a class="homeLink" href="index.html">Back to Search</a></div>
  </div>
</div>`;
  $("#favourite-container").append(emptyFavourites);
};

const renderFavouritesCards = (favourites) => {
  if (favourites.length === 0) {
    renderEmptyFavourites();
  } else {
    favourites.forEach(renderFavCountryCard);
  }
};

const onLoad = () => {
  const favourites = getFromLocalStorage();

  renderFavouritesCards(favourites);
};

$(document).ready(onLoad);
