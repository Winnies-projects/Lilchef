// Function to fetch a random dish from the meal database
function fetchRandomDish() {
  axios
    .get(
      "https://www.themealdb.com/api/json/v1/1/random.php"
      )
    .then(function (response) {
      // Extracting information about the random dish from the API response
      const randomDish = response.data.meals[0];

      // Updating the HTML elements with the random dish information
      const randomImageElement = document.getElementById("randomImage");
      const randomNameElement = document.getElementById("randomname");
      const randomMealTypeElement = document.getElementById("randomMealtype");
      const randomMealFromElement = document.getElementById("randomMealfrom");

      randomImageElement.src = randomDish.strMealThumb;
      randomNameElement.innerText = randomDish.strMeal;
      randomMealTypeElement.innerText = randomDish.strCategory;
      randomMealFromElement.innerText = randomDish.strArea;

      // To fetch and display ingredients
      displayIngredients(randomDish.idMeal);
    })
    
    .catch(function (error) {
      console.error("Error fetching random dish:", error);
    });

     // Event listeners for displaying and hiding the recipe card modal
    document.getElementById("recipelist").addEventListener("click", function () {
      document.getElementById("recipecard").style.display = "block";
    });

    document.querySelector(".close").addEventListener("click", function () {
      document.getElementById("recipecard").style.display = "none";
    });
}

// Function to display ingredients for a given meal
function displayIngredients(mealId){

  axios
    .get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      )
    .then(function (response) {
      const ingredients = getIngredients(response.data.meals[0]);
      updatedIngredients(ingredients);
    })
    .catch(function (error) {
      console.error("Error fetching ingredients:", error);
    });
}

// Array to store ingredients
const ingredients = [];

function getIngredients(dish){

  for (let i = 1; i <= 30; i++) {
    const ingredient = dish[`strIngredient${i}`];
    const measure = dish[`strMeasure${i}`];

    if (ingredient) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return ingredients;
}


// Function to update the displayed ingredients in the modal
function updatedIngredients(ingredients){
  const ingredientsElement = document.getElementById("ingredients");
  ingredientsElement.innerText = ingredients.join("\n");
}

// Execute the fetchRandomDish function when the window is loaded
window.onload = () => {
  fetchRandomDish();
}

// Function to search for meals based on the category
function searchMeal() {
  const searchInput = document.getElementById('searchbar').value.trim();
  
  axios
  .get(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchInput}`
    )

    .then(response => {
        const meals = response.data.meals;
        displaySearchedDish(meals);
        scrollToResults();
    })

    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Error fetching data. Please try again.');
    });
}

// Function to display all the searched meals
function displaySearchedDish(meals) {
  const mealContainer = document.getElementById('mealContainer');
  mealContainer.innerHTML = '';


  meals.forEach(meal => {
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal-item');

    const mealImg = document.createElement('img');
    mealImg.classList.add('meal-img');
    mealImg.src = meal.strMealThumb;
    mealImg.alt = meal.strMeal;

    const dishName = document.createElement('button');
    dishName.textContent = meal.strMeal;


    mealDiv.appendChild(mealImg);
    mealDiv.appendChild(dishName);
    mealContainer.appendChild(mealDiv);
  });
}


// Function to scroll to the search results section
function scrollToResults() {
  const mealContainer = document.getElementById('mealContainer');
  const yOffset = mealContainer.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: yOffset, behavior: 'smooth' });
}
