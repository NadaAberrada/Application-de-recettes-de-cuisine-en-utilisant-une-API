const searchBtn = document.getElementById("btnsearch");
var userInput = document.getElementById("inputsearch");

//afichagge par defaut
var test;
for (let i = 0; i < 6; i++) {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        data.meals.forEach((meal) => {
          test = meal.strMeal;
          var datacard = "";
          // console.log(meal.strMealThumb);
          var mealList = document.getElementById("cardsaffiche");

          datacard +=
            " <div class = 'card text-center col-lg-3 col-md-5 cold-sm-10 m-1 ' id='kanhna'     style='background-color: rgba(64, 64, 63, 0.588)'>" +
            "<img src=" +
            meal.strMealThumb +
            " class='card-img-top'>" +
            "<div class='card-body'><h6 class='card-title'>" +
            meal.strMeal +
            "</h6>" +
            "<a href='#' class='show btn  mb-0 w-75' data-bs-toggle='modal data-bs-target='#exampleModal' style='background-color: rgb(234, 146, 51)' id='" +
            meal.idMeal +
            // "'>Details</a>" +
            "' onclick ='linkdeatail(" +
            meal.idMeal +
            ")' >Details</a>" +
            "</div></div>";

          mealList.insertAdjacentHTML("afterbegin", datacard);
        });
      }
    });
}

//search
searchBtn.addEventListener("click", getMealList);
function getMealList() {
  let searchMatch = userInput.value.trim();
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchMatch}`)
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      var mealList = document.getElementById("cardsaffiche");
      // mealList.insertAdjacentHTML("afterbegin", "");
      while (mealList.hasChildNodes())
        mealList.removeChild(mealList.firstChild);

      if (data.meals) {
        data.meals.forEach((meal) => {
          html +=
            " <div class = 'card text-center col-lg-3 col-md-5 cold-sm-10 m-1 '     style='background-color: rgba(64, 64, 63, 0.588)'>" +
            "<img src=" +
            meal.strMealThumb +
            " class='card-img-top'>" +
            "<div class='card-body'><h6 class='card-title'>" +
            meal.strMeal +
            "</h6>" +
            "<a href='#' class='show btn   mb-0 w-75' data-bs-toggle='modal data-bs-target='#exampleModal' style='background-color: rgb(234, 146, 51)' id='" +
            meal.idMeal +
            // "'>Details</a>" +
            "' onclick ='linkdeatail(" +
            meal.idMeal +
            ")' >Details</a>" +
            "</div></div>";

          mealList.insertAdjacentHTML("afterbegin", html);
        });
      }
    });
}
//modal
function linkdeatail(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((idData) => mealReciepeModal(idData.meals));
}
//modal
function mealReciepeModal(meal) {
  // console.log(meal[0]);
  meal = meal[0];
  let count = 1;
  let ing = "";

  for (let i in meal) {
    while (meal["strIngredient" + count] !== "") {
      ing += "<li>" + meal["strIngredient" + count] + "</li>";
      count++;
    }
  }

  let html =
    "<div class='modal fade' aria-labelledby='exampleModalLabel' id='exampleModal' tabindex='-1' style='display:flex; opacity:1; aria.hidden='true' ><div class='modal-dialog modal-dialog-centered modal-dialog-scrollable'>" +
    "<div class='modal-content'><div class='modal-header'><h1 class='modal-title fs-5' id='exampleModalLabel'>" +
    meal.strMeal +
    "</h1>" +
    "<button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button></div>" +
    "<div class='modal-body'>" +
    "<img src=" +
    meal.strMealThumb +
    " class='img-thumbnail ' style='height:200px;'>" +
    "<h4>Category:&nbsp" +
    meal.strCategory +
    "</h4>" +
    "<h4>Area:&nbsp" +
    meal.strArea +
    "</h4>" +
    "<h4>Ingredients:</h4>" +
    "<ul class='ms-5' id='ulModal'>" +
    ing +
    "</ul>" +
    "<h4>Instructions:&nbsp</h4>" +
    "<p class='mx-3'>" +
    meal.strInstructions +
    "</p>" +
    "</div></div></div></div>";

  document.getElementById("test").insertAdjacentHTML("afterend", html);

  document.querySelector(".btn-close").addEventListener("click", () => {
    document.getElementById("exampleModal").style.display = "none";
  });
}
