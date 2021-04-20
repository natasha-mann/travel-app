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

// set empty array in local storage if not present
const initialiseLocalStorage = () => {
  const localStorageData = localStorage.getItem("favourites");
  if (!localStorageData) {
    localStorage.setItem("favourites", JSON.stringify([]));
  }
};
