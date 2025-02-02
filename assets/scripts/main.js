// main.js

// Here is where the recipes that you will fetch.
// Feel free to add your own here for part 2, if they are local files simply add their path as a string.
const recipes = [
  'https://introweb.tech/assets/json/ghostCookies.json',
  'https://introweb.tech/assets/json/birthdayCake.json',
  'https://introweb.tech/assets/json/chocolateChip.json',
  "assets/recipes/vegan-hot-dogs.json",
  "assets/recipes/noodle-soup.json",
  "assets/recipes/dirt-cup.json",
  "assets/recipes/thanos-krispies.json",
  "assets/recipes/krabby-patty.json",
  "assets/recipes/sweetrolls.json",
];

// Once all of the recipes that were specified above have been fetched, their
// data will be added to this object below. You may use whatever you like for the
// keys as long as it's unique, one suggestion might but the URL itself
const recipeData = {}

const hiddenElements = [];

window.addEventListener('DOMContentLoaded', init);

// This is the first function to be called, so when you are tracing your code start here.
async function init() {
  // fetch the recipes and wait for them to load
  let fetchSuccessful = await fetchRecipes();
  // if they didn't successfully load, quit the function
  if (!fetchSuccessful) {
    console.log('Recipe fetch unsuccessful');
    return;
  };
  // Add the first three recipe cards to the page
  createRecipeCards();
  // Make the "Show more" button functional
  bindShowMore(3);
}

async function fetchRecipes() {
  return new Promise((resolve, reject) => {
    // This function is called for you up above
    // From this function, you are going to fetch each of the recipes in the 'recipes' array above.
    // Once you have that data, store it in the 'recipeData' object. You can use whatever you like
    // for the keys. Once everything in the array has been successfully fetched, call the resolve(true)
    // callback function to resolve this promise. If there's any error fetching any of the items, call
    // the reject(false) function.

    // For part 2 - note that you can fetch local files as well, so store any JSON files you'd like to fetch
    // in the recipes folder and fetch them from there. You'll need to add their paths to the recipes array.

    for(let i = 0; i < recipes.length; i++){
      fetch(recipes[i])   //fetch returns a Promise 
        .then(response => response.json())    //Promise is passed as parameter "response" to call response.json()
        .then(data => {
          recipeData[recipes[i]] = data;   //Return value of response.json is passed as data
          if(Object.keys(recipeData).length == recipes.length) resolve(true);
        })
        .catch(error => reject(false));
    }
  });
}

function createRecipeCards() {
  // This function is called for you up above.
  // From within this function you can access the recipe data from the JSON 
  // files with the recipeData Object above. Make sure you only display the 
  // three recipes we give you, you'll use the bindShowMore() function to
  // show any others you've added when the user clicks on the "Show more" button.
  let main = document.querySelector("main");
  for(let i = 0; i < recipes.length; i++){
    let element = document.createElement("recipe-card");
    element.data = recipeData[recipes[i]];
    if(i < 3) main.appendChild(element); else hiddenElements.push(element);
  }
}

function bindShowMore(max = -1) {
  // This function is also called for you up above.
  // Use this to add the event listener to the "Show more" button, from within 
  // that listener you can then create recipe cards for the rest of the .json files
  // that were fetched. You should fetch every recipe in the beginning, whether you
  // display it or not, so you don't need to fetch them again. Simply access them
  // in the recipeData object where you stored them/
  if(max == -1) max = hiddenElements.length;
  var showMore = document.getElementById("button-wrapper").querySelector("button");
  showMore.addEventListener("click", (event) => {
    let main = document.querySelector("main");
    if(showMore.textContent == "Show more"){
      for(let i = 0; i < max; i++){
        main.appendChild(hiddenElements[i]);
      }
      showMore.textContent = "Show less";
    }
    else{
      for(let i = 0; i < max; i++){
        main.removeChild(hiddenElements[i]);
      }
      showMore.textContent = "Show more";
    }
  });
}