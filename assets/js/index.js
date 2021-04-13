// function called on submit of search form
const onSubmit = async (event) => {
  event.preventDefault();

  const countryName = $("#search-bar").val();
  console.log(countryName);
};

$("#start-form").on("submit", onSubmit);
