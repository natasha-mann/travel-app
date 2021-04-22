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

/*
 Functions for local storage
 */
const initialiseLocalStorage = () => {
  const localStorageFavs = localStorage.getItem("favourites");
  const localStorageSearches = localStorage.getItem("searches");
  if (!localStorageFavs) {
    localStorage.setItem("favourites", JSON.stringify([]));
  }
  if (!localStorageSearches) {
    localStorage.setItem("searches", JSON.stringify([]));
  }
};

const getFromLocalStorage = (storageName) => {
  const storage = localStorage.getItem(storageName);
  if (storage) {
    return JSON.parse(storage);
  } else {
    return [];
  }
};

const addLastSearch = () => {
  const countryName = $("#search-bar").val();

  const searchObj = { country: countryName };

  const lastSearchList = JSON.parse(localStorage.getItem("searches"));
  if (
    !lastSearchList.some((item) => item.country === countryName) ||
    lastSearchList.length === 0
  ) {
    lastSearchList.push(searchObj);
    if (lastSearchList.length > 3) {
      lastSearchList.shift();
    }
    localStorage.setItem("searches", JSON.stringify(lastSearchList));
  }
};

// extract data needed from api call to use for photo and description on places card
const getValueFromNestedObject = (
  nestedObj = {},
  tree = [],
  defaultValue = ""
) =>
  Array.isArray(tree)
    ? tree.reduce(
        (obj, key) => (obj && obj[key] ? obj[key] : defaultValue),
        nestedObj
      )
    : {};
