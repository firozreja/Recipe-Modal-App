//up to top btn
const arrowUpBtn = document.getElementById("arrowUpBtn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    arrowUpBtn.classList.remove("hidden");
  } else {
    arrowUpBtn.classList.add("hidden");
  }
});
arrowUpBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// get food data with api call
const foodContainer = document.getElementById("food-container");
const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

async function getFoodData() {
  try {
    foodContainer.innerHTML = `
        <div class="col-span-full text-center text-gray-500 animate-pulse text-5xl mt-4">Loading...</div>`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.meals) {
      foodContainer.innerHTML = `<div class="col-span-full text-center text-red-500"> No food found 😢</div>`;
      return;
    }
    displayFoods(data.meals);
  } catch (error) {
    foodContainer.innerHTML = `
      <div class="col-span-full text-center text-red-500 mt-10">
        Something went wrong ⚠️ Check your connection.
      </div>
    `;
  }
}

// display food card
function displayFoods(meals) {
  foodContainer.innerHTML = "";

  meals.forEach((meal) => {
    const itemCard = `
            <div class="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
                <div class="h-48 overflow-hidden">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"
                        class="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>

                <div class="p-5">
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">
                        ${meal.strMeal}
                    </h2>

                    <p class="text-gray-600 text-sm line-clamp-3 mb-4">
                        ${meal.strInstructions}
                    </p>

                    <button onclick="openRecipe('${meal.idMeal}')"
                        class="w-full bg-yellow-500 hover:bg-yellow-600 outline-none text-white font-medium py-2.5 rounded-lg cursor-pointer">
                        View Details
                    </button>
                </div>
            </div>
        `;
    foodContainer.innerHTML += itemCard;
  });
}

// modal section
const recipeModal = document.getElementById("recipe-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDecs = document.getElementById("modal-decs");
const modalYoutubeLink = document.getElementById("youtube-link");

async function openRecipe(mealId) {
  modalImg.classList.add("hidden");
  recipeModal.classList.remove("opacity-0", "pointer-events-none");
  document.body.style.overflow = "hidden";

  //data loading stage
  modalImg.src = "";
  modalTitle.textContent = "Loading..";
  modalDecs.textContent = "";
  modalYoutubeLink.href = "#";

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await res.json();
    const meal = data.meals[0];

    //update modal data
    modalTitle.textContent = meal.strMeal;
    modalDecs.textContent = meal.strInstructions;
    modalYoutubeLink.href = meal.strYoutube;
    const img = new Image();
    img.src = meal.strMealThumb;

    img.onload = () => {
      modalImg.src = img.src;
      modalImg.classList.remove("hidden");
    };
  } catch (error) {
    modalTitle.textContent = "Error";
    modalDecs.textContent = "Failed to load recipe";
  }
}

//close modal
const closeBtn = document.getElementById("close-btn");
closeBtn.addEventListener("click", () => {
  recipeModal.classList.add("opacity-0", "pointer-events-none");
  document.body.style.overflow = "auto";
});

// search food
const searchInput = document.getElementById("search-value");
async function getFood() {
  const foodName = searchInput.value.toLowerCase().trim();

  if (foodName === "") {
    alert("You did not search anything");
    getFoodData();
    return;
  }

  foodContainer.innerHTML = `<div class="col-span-full text-center text-gray-500 animate-pulse text-3xl mt-10">Searching for "${foodName}"...</div>`;

  try {
    const apiUrlName = `https://www.themealdb.com/api/json/v1/1/search.php?s=${foodName}`;
    const res = await fetch(apiUrlName);
    const data = await res.json();

    if (data.meals == null) {
      foodContainer.innerHTML = `
      <div class="col-span-full text-center mt-10">
        <p class="text-2xl font-bold text-gray-600">No data found for "${foodName}" 😢</p>
      </div>`;
      return;
    }

    displayFoods(data.meals);
  } catch (error) {
    foodContainer.innerHTML = `<div class="col-span-full text-center text-red-500 mt-10>Error connecting to API ⚠️</div>`;
  }
}

// first api call for get all data
getFoodData();
