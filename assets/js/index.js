// set empty array in local storage if not present
const initialiseLocalStorage = () => {
  const localStorageData = localStorage.getItem("favourites");
  if (!localStorageData) {
    localStorage.setItem("favourites", JSON.stringify([]));
  }
};

// function called on submit of search form
const onSubmit = (event) => {
  event.preventDefault();

  const countryName = $("#search-bar").val();

  initialiseLocalStorage();

  if (countryName) {
    window.location.href = `/results.html?country=${countryName}`;
  }
};

$("#start-form").on("submit", onSubmit);
