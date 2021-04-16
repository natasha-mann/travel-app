const getFromLocalStorage = () => {
  const favourites = localStorage.getItem("favourites");
  console.log(favourites);
};

const onLoad = () => {
  getFromLocalStorage();

  // renderFavouritesCards();
};

$(document).ready(onLoad);
