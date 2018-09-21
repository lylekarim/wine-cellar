$(document).ready(function() {
  var config = {
    apiKey: "AIzaSyAA89Se884k_LhKKY9GFcVOpRqFZp9aCEE",
    authDomain: "july2018uofr.firebaseapp.com",
    databaseURL: "https://july2018uofr.firebaseio.com",
    projectId: "july2018uofr",
    storageBucket: "july2018uofr.appspot.com",
    messagingSenderId: "266739656289"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  function buildQueryURL(input) {
    // queryURL is the url we'll use to query the API
    var queryURL = "http://api.snooth.com/wines/?";

    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = {
        akey: "b0jsh3j9ckyksr2k5xu3t8mgd6tqs5wqcseanmyg1ikcnv9j",
        q: "Little Penguin Chardonnay",
        color: "red",
        
    };

    //Checks for input, add to the queryParams object
    // queryParams.color = input.color;
    // if (input.type.length > 0) {
    //     queryParams.vintage = input.type;
    // }
    // if (input.year.length > 0) {
    //     queryParams.year = input.year;
    // }
    // if (input.region.length > 0) {
    //   queryParams.region = input.region;
    // }

    // queryParams.n = count;

    return queryURL + $.param(queryParams);
  }

  $("#run-search").on("click", function(event) {
    event.preventDefault();

    var wineType = $("#select-varietal").val()[0];
    var wineRegion = $("#input-wine-region").val();
    //var totalSearch = $("#")
    var wineColor = $("#input-wine-color").val()[0];
    console.log(wineColor);

    var holdingObject = {};
    if(wineType.length >0){
        holdingObject.type = wineType
    }
    if(wineRegion.length >0){
        holdingObject.region = wineRegion;
    }
    
    var queryURL = buildQueryURL(holdingObject);
    
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
          console.log(JSON.parse(response));
      });
  });
});