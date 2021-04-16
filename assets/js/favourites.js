const getFromLocalStorage = () => {
  const favourites = localStorage.getItem("favourites");
  if (favourites) {
    return JSON.parse(favourites);
  } else {
    return [];
  }
};

const renderFavCountryCard = (item) => {
  console.log(item);
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
