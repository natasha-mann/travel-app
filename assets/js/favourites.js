const getFromLocalStorage = () => {
  const favourites = localStorage.getItem("favourites");
  if (favourites) {
    return JSON.parse(favourites);
  } else {
    return [];
  }
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
  $("#favourite-container").empty();

  if (favourites.length === 0) {
    renderEmptyFavourites();
  } else {
    favourites.forEach(renderFavCountryCard);
  }
};

const renderFavCountryCard = (item) => {
  const favCountryCard = `<div class="ui centered card" id="research" data-country="${item.country}">
  <div class="image" >
    <img src= "${item.flag}"/>
  </div>
  <div class="content ui grid col-4 center aligned" >
    <div class="header">${item.country}</div>
  </div>
  <div class="ui bottom attached button" name="removeFavourite">Remove from Favourites</div>
</div>`;
  $("#favourite-container").append(favCountryCard);
  $('div[name="removeFavourite"]').click(removeFromFavourites);
  $(document).on("click", "#research", researchCountry);
};

const researchCountry = (event) => {
  const target = $(event.target);
  if (target.is("img")) {
    const parent = $(target).closest("#research");
    const country = parent.data("country");
    window.location.href = `/results.html?country=${country}`;
  }
};

const removeFromFavourites = (event) => {
  const target = $(event.target);
  const parent = $(target).closest("#research");
  const country = parent.data("country");
  const favourites = JSON.parse(localStorage.getItem("favourites"));
  const callback = (each) => {
    if (each.country === country) {
      return false;
    } else {
      return true;
    }
  };
  const filteredFavourites = favourites.filter(callback);
  localStorage.setItem("favourites", JSON.stringify(filteredFavourites));
  renderFavouritesCards(filteredFavourites);
};

const onLoad = () => {
  const favourites = getFromLocalStorage();

  renderFavouritesCards(favourites);
};

$(document).ready(onLoad);
