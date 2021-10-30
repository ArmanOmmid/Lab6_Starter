class RecipeCard extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    // You'll want to attach the shadow DOM here
  }

  set data(data) {
    // This is the CSS that you'll use for your recipe cards
    const styleElem = document.createElement('style');
    const styles = `
      * {
        font-family: sans-serif;
        margin: 0;
        padding: 0;
      }
      
      a {
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
      
      article {
        align-items: center;
        border: 1px solid rgb(223, 225, 229);
        border-radius: 8px;
        display: grid;
        grid-template-rows: 118px 56px 14px 18px 15px 36px;
        height: auto;
        row-gap: 5px;
        padding: 0 16px 16px 16px;
        width: 178px;
      }

      div.rating {
        align-items: center;
        column-gap: 5px;
        display: flex;
      }
      
      div.rating > img {
        height: auto;
        display: inline-block;
        object-fit: scale-down;
        width: 78px;
      }

      article > img {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        height: 118px;
        object-fit: cover;
        margin-left: -16px;
        width: calc(100% + 32px);
      }

      p.ingredients {
        height: 32px;
        line-height: 16px;
        padding-top: 4px;
        overflow: hidden;
      }
      
      p.organization {
        color: black !important;
      }

      p.title {
        display: -webkit-box;
        font-size: 16px;
        height: 36px;
        line-height: 18px;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      p:not(.title), span, time {
        color: #70757A;
        font-size: 12px;
      }
    `;
    styleElem.innerHTML = styles;

    // Here's the root element that you'll want to attach all of your other elements to
    const card = document.createElement('article');
    
    // Create/append img element
    const img = document.createElement("img");
    let imgSrc = getImageUrl(data);
    let imgAlt = getTitle(data);
    img.setAttribute("src", imgSrc);
    img.setAttribute("alt", imgAlt);
    card.appendChild(img);
    
    // Create/append p element ; class title
    const title = document.createElement("p");
    title.setAttribute("class", "title");
    const titleLink = document.createElement("a");
    let titleLinkHref = getUrl(data);
    titleLink.textContent = imgAlt;
    titleLink.setAttribute("href", titleLinkHref);
    title.appendChild(titleLink);
    card.appendChild(title);

    // Create/append p element ; class organization
    const organization = document.createElement("p");
    let organizationName = getOrganization(data);
    organization.setAttribute("class", "organization");
    organization.textContent = organizationName;
    card.appendChild(organization);

    // Create/append div element ; class rating
    const rating = document.createElement("div");
    rating.setAttribute("class", "rating");
    let ratingList = getRatings(data);
    if(ratingList){
      let value = Math.round(ratingList[0]*100)/100;
      let count = ratingList[1];
      // Create/append span element ; average score
      const ratingValue = document.createElement("span");
      ratingValue.textContent = value;
      rating.appendChild(ratingValue);
      // Create/append img element ; stars
      const stars = document.createElement("img");
      let starSrc = "assets/images/icons/" + Math.round(value) + "-star.svg";
      let starAlt = value + " stars";
      stars.setAttribute("src", starSrc);
      stars.setAttribute("alt", starAlt);
      rating.appendChild(stars);
      // Create/append span element ; average score
      const ratingCount = document.createElement("span");
      ratingCount.textContent = "(" + count + ")";
      rating.appendChild(ratingCount);
    }
    else{
      // Create/append span element ; no reviews
      const noReviews = document.createElement("span");
      noReviews.textContent = "No Reviews";
      rating.appendChild(noReviews);
    }
    card.appendChild(rating);

    // Create/append time element
    const time = document.createElement("time");
    let timeContent = getTime(data);
    time.textContent = convertTime(timeContent);
    card.appendChild(time);

    // Create/append p element ; class ingredients
    const ingredients = document.createElement("p");
    ingredients.setAttribute("class", "ingredients");
    let ingredientsArray = getIngredients(data);
    let ingredientsCSV = createIngredientList(ingredientsArray);
    ingredients.textContent = ingredientsCSV;
    card.appendChild(ingredients);


    this.shadowRoot.appendChild(styleElem);
    this.shadowRoot.appendChild(card);



    // Some functions that will be helpful here:
    //    document.createElement()
    //    document.querySelector()
    //    element.classList.add()
    //    element.setAttribute()
    //    element.appendChild()
    //    & All of the helper functions below

    // Make sure to attach your root element and styles to the shadow DOM you
    // created in the constructor()

    // Part 1 Expose - TODO
  }
}


/*********************************************************************/
/***                       Helper Functions:                       ***/
/***          Below are some functions I used when making          ***/
/***     the solution, feel free to use them or not, up to you     ***/
/*********************************************************************/

/**
 * Recursively search for a key nested somewhere inside an object
 * @param {Object} object the object with which you'd like to search
 * @param {String} key the key that you are looking for in the object
 * @returns {*} the value of the found key
 */
function searchForKey(object, key) {
  var value;
  Object.keys(object).some(function (k) {
    if (k === key) {
      value = object[k];
      return true;
    }
    if (object[k] && typeof object[k] === 'object') {
      value = searchForKey(object[k], key);
      return value !== undefined;
    }
  });
  return value;
}

/**
 * Custom Function
 */
 function getImageUrl(data) {
  if(data.image){
    if(data.image.url){
      return data.image.url;
    }
    if(typeof(data.image) == "object"){
      return data.image[0];
    }
  }
  if (data['@graph']) {
    for (let i = 0; i < data['@graph'].length; i++) {
      if (data['@graph'][i]['@type'] == 'ImageObject') return data['@graph'][i].url;
    }
  };
  return null;
}

/**
 * Custom Function
 */
function getTitle(data) {
  if (data.name) return data.name;
  if (data['@graph']) {
    for (let i = 0; i < data['@graph'].length; i++) {
      if (data['@graph'][i]['@type'] == 'Article') return data['@graph'][i].headline;
    }
  };
  return null;
}

/**
 * Custom Function
 */
 function getRatings(data) {
  let ratings = [];
  let valueSFK = searchForKey(data, "ratingValue");
  let countSFK = searchForKey(data, "ratingCount");
  if(!valueSFK) valueSFK = searchForKey(data, "reviewValue");
  if(!countSFK) countSFK = searchForKey(data, "reviewCount");
  if(valueSFK && countSFK){
    ratings.push(valueSFK);
    ratings.push(countSFK);
    return ratings;
  }
  // Rest Not Needed
  if (data['@graph']) {
    for (let i = 0; i < data['@graph'].length; i++) {
      if (data['@graph'][i]['@type'] == 'Recipe'){
        if(data['@graph'][i].aggregateRating){
          let value = data['@graph'][i].aggregateRating.ratingValue;
          let count = data['@graph'][i].aggregateRating.ratingCount;
          ratings.push(value);
          ratings.push(count);
        }
      }
    }
  };
  if(ratings.length) return ratings;
  return null;
}

/**
 * Custom Function
 */
 function getTime(data) {
  if(data.totalTime) return data.totalTime;
  if (data['@graph']) {
    for (let i = 0; i < data['@graph'].length; i++) {
      if (data['@graph'][i]['@type'] == 'Recipe'){
        return data['@graph'][i].totalTime;
      }
    }
  };
  return null;
}

/**
 * Custom Function
 */
 function getIngredients(data) {
  if(data.recipeIngredient) return data.recipeIngredient;
  let sfk = searchForKey(data, "recipeIngredient");
  if(sfk) return sfk;
  // Rest Not Needed;
  if (data['@graph']) {
    for (let i = 0; i < data['@graph'].length; i++) {
      if (data['@graph'][i]['@type'] == 'Recipe'){
        return data['@graph'][i].recipeIngredient;
      }
    }
  };
  return null;
}

/**
 * Extract the URL from the given recipe schema JSON object
 * @param {Object} data Raw recipe JSON to find the URL of
 * @returns {String} If found, it returns the URL as a string, otherwise null
 */
function getUrl(data) {
  if (data.url) return data.url;
  if (data['@graph']) {
    for (let i = 0; i < data['@graph'].length; i++) {
      if (data['@graph'][i]['@type'] == 'Article') return data['@graph'][i]['@id'];
    }
  };
  return null;
}

/**
 * Similar to getUrl(), this function extracts the organizations name from the
 * schema JSON object. It's not in a standard location so this function helps.
 * @param {Object} data Raw recipe JSON to find the org string of
 * @returns {String} If found, it retuns the name of the org as a string, otherwise null
 */
function getOrganization(data) {
  if (data.publisher?.name) return data.publisher?.name;
  let publisher = searchForKey(data, "publisher");
  if(typeof(publisher) == String) return publisher;
  if (data['@graph']) {
    for (let i = 0; i < data['@graph'].length; i++) {
      if (data['@graph'][i]['@type'] == 'Organization') {
        return data['@graph'][i].name;
      }
      if (data['@graph'][i]['@type'] == 'WebSite') {
        return data['@graph'][i].name;
      }
    }
  };
  let websiteName = getUrl(data);
  if(websiteName){
    let end = websiteName.indexOf(".com");
    websiteName = websiteName.slice(0, end);
    let start = websiteName.indexOf("//");
    websiteName = websiteName.slice(start+2);
    let start2 = websiteName.indexOf(".");
    if(start2) websiteName = websiteName.slice(start2+1);
    return websiteName;
  }
  return null;
}

/**
 * Converts ISO 8061 time strings to regular english time strings.
 * Not perfect but it works for this lab
 * @param {String} time time string to format
 * @return {String} formatted time string
 */
function convertTime(time) {
  let timeStr = '';

  // Remove the 'PT'
  time = time.slice(2);

  let timeArr = time.split('');
  if (time.includes('H')) {
    for (let i = 0; i < timeArr.length; i++) {
      if (timeArr[i] == 'H') return `${timeStr} hr`;
      timeStr += timeArr[i];
    }
  } else {
    for (let i = 0; i < timeArr.length; i++) {
      if (timeArr[i] == 'M') return `${timeStr} min`;
      timeStr += timeArr[i];
    }
  }

  return '';
}

/**
 * Takes in a list of ingredients raw from imported data and returns a neatly
 * formatted comma separated list.
 * @param {Array} ingredientArr The raw unprocessed array of ingredients from the
 *                              imported data
 * @return {String} the string comma separate list of ingredients from the array
 */
function createIngredientList(ingredientArr) {
  let finalIngredientList = '';

  /**
   * Removes the quantity and measurement from an ingredient string.
   * This isn't perfect, it makes the assumption that there will always be a quantity
   * (sometimes there isn't, so this would fail on something like '2 apples' or 'Some olive oil').
   * For the purposes of this lab you don't have to worry about those cases.
   * @param {String} ingredient the raw ingredient string you'd like to process
   * @return {String} the ingredient without the measurement & quantity 
   * (e.g. '1 cup flour' returns 'flour')
   */
  function _removeQtyAndMeasurement(ingredient) {
    return ingredient.split(' ').splice(2).join(' ');
  }

  ingredientArr.forEach(ingredient => {
    ingredient = _removeQtyAndMeasurement(ingredient);
    finalIngredientList += `${ingredient}, `;
  });

  // The .slice(0,-2) here gets ride of the extra ', ' added to the last ingredient
  return finalIngredientList.slice(0, -2);
}

// Define the Class so you can use it as a custom element.
// This is critical, leave this here and don't touch it
customElements.define('recipe-card', RecipeCard);
