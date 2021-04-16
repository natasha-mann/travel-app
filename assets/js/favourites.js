const getFromLocalStorage = () => {
  const favourites = localStorage.getItem("favourites");
  if (favourites) {
    return JSON.parse(favourites);
  } else {
    return [];
  }
};

const onLoad = () => {
  getFromLocalStorage();

  // renderFavouritesCards();
};

$(document).ready(onLoad);
