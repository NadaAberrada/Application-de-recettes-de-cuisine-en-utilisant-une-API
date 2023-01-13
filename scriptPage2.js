const selectRegion = document.getElementById("selectRegion");
const selectCate = document.getElementById("selectCate");
const paginationList = document.getElementsByClassName("pagination")[0];

// data
var currentData = [];
var setcurrentData = (data) => {
  currentData = data;
  paintItemsRegion(0);
};

//remplir selects
const initFields = async () => {
  var res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
  );
  var categoryData = await res.json();
  categoryData.meals.reverse().forEach((meal) => {
    let optionItem = `<option value= ${meal.strCategory} ${
      meal.strCategory == "Lamb" ? "selected" : ""
    }> ${meal.strCategory}</option>`;
    selectCate.insertAdjacentHTML("afterbegin", optionItem);
  });

  var res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  // console.log('test')
  const areaData = await res.json();

  areaData.meals.reverse().forEach((meal) => {
    let optionItem = `<option value= ${meal.strArea} ${
      meal.strArea == "Moroccan" ? "selected" : ""
    }> ${meal.strArea}</option>`;
    selectRegion.insertAdjacentHTML("afterbegin", optionItem);
  });
  //par defauts
  getItemsRegion();
  // getItemsCategorie()

  //si on a select
  selectRegion.addEventListener("change", getItemsRegion);
  selectCate.addEventListener("change", getItemsCategorie);
};

//remplir cards par Region
let paintItemsRegion = (index) => {
  var mealList = document.getElementById("cardsaffiche");
  mealList.innerHTML = "";
  if (currentData.meals) {
    while (mealList.hasChildNodes()) mealList.removeChild(mealList.firstChild);

    for (let i = index * 6; i < index + 6; i++) {
      // console.log("i" + i);
      let meal = currentData.meals[i];

      let html =
        " <div class = 'card text-center col-lg-3 col-md-5 cold-sm-10 m-1 '     style='background-color: rgba(64, 64, 63, 0.588)'>" +
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

      mealList.insertAdjacentHTML("afterbegin", html);
    }
  }
};
//remplir cards par categorie
let paintItemscategorie = (index) => {
  var mealList = document.getElementById("cardsaffiche");
  mealList.innerHTML = "";
  if (currentData.meals) {
    while (mealList.hasChildNodes()) mealList.removeChild(mealList.firstChild);
    // console.log(currentData)
    for (let i = index * 6; i < index + 6; i++) {
      let meal = currentData.meals[i];

      let html =
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
    }
  }
};
//modal
function linkdeatail(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((response) => response.json())
    .then((idData) => mealReciepeModal(idData.meals));
  console.log(mealId);
  console.log(idData.meals);
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
    "<div class='modal fade' aria-labelledby='exampleModalLabel' id='exampleModal' tabindex='-1' style='display:flex; opacity:1; aria.hidden='true'><div class='modal-dialog modal-dialog-centered modal-dialog-scrollable'>" +
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
//select Region pagination
let getItemsRegion = async () => {
  let regionName = selectRegion.options[selectRegion.selectedIndex].value;

  let res = await fetch(
    `https://themealdb.com/api/json/v1/1/filter.php?a=${regionName}`
  );
  const data = await res.json();
  handlePaginationRegion(data.meals.length);
  //when the url change
  window.addEventListener("hashchange", function () {
    const poundIndex = window.location.href.indexOf("#");

    // Extract the substring after the '#' character
    const currentPage = window.location.href.substring(poundIndex + 1);
    // console.log("currentPagdsgvsrqgbsrehbsthe" + currentPage);
    paintItemsRegion(currentPage);
  });
  setcurrentData(data);
};
//select  categorie pagination
// This JavaScript code is registering an event listener
// on the window object that listens for changes to
//  the URL hash (the part of the URL after the "#" symbol).
//  When the event fires, it is executing a callback function
//  that retrieves the current URL of the page using the window.location.href
//  property and finds the index of the "#" symbol using the indexOf("#") method.
//   Then, it uses the substring() method to extract the part of the URL after the
//   "#" symbol and store it in a variable called currentPage.
let getItemsCategorie = async () => {
  let categoryName = selectCate.options[selectCate.selectedIndex].value;

  let res = await fetch(
    `https://themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
  );
  const data = await res.json();
  handlePaginationcategorie(data.meals.length);
  window.addEventListener("hasshchange", function () {
    const poundIndex = window.location.href.indexOf("#");

    // Extract the substring after the '#' character
    const currentPage = window.location.href.substring(poundIndex + 1);

    paintItemscategorie(currentPage);
  });
  setcurrentData(data);
};
//pagination button Region
let handlePaginationRegion = (count) => {
  let pageCount = count / 6;

  paginationList.innerHTML = "";
  for (let i = 0; i <= pageCount; i++) {
    paginationList.innerHTML += `<li class="page-item"><a class="page-link" href="#${i}">${i}</a></li>`;
  }
};
//pagination button categorie
let handlePaginationcategorie = (count) => {
  let pageCount = count / 6;
  // while (paginationList.hasChildNodes())
  //   paginationList.removeChild(paginationList.firstChild);

  paginationList.innerHTML = "";

  for (let i = 0; i <= pageCount; i++) {
    paginationList.innerHTML += `<li class="page-item"><a class="page-link" href="#${i}">${i}</a></li>`;
  }
};
//select deux selects
function select() {
  let regionName = selectRegion.options[selectRegion.selectedIndex].value;
  let categoryName = selectCate.options[selectCate.selectedIndex].value;

  var mealList = document.getElementById("cardsaffiche");
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s`)
    .then((Response) => Response.json())
    .then((data) => {
      let html;
      while (mealList.hasChildNodes())
        mealList.removeChild(mealList.firstChild);
      while (paginationList.hasChildNodes())
        paginationList.removeChild(paginationList.firstChild);

      data.meals.forEach((meal) => {
        if (meal.strArea == regionName && meal.strCategory == categoryName) {
          console.log("hi" + meal.strMeal);
          let html =
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
        }
      });
    });
}
function btnselect() {
  select();
  // document.getElementsByName('pagination').style.display = 'block'
}
//apelle method
initFields();
