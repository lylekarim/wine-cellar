//Sample Snooth API returns:

// image: "http://ei.isnooth.com/multimedia/e/1/5/image_1960028_square.jpeg"
// link: "http://www.snooth.com/wine/pavilion-cabernet-sauvignon-napa-valley-2010/"
// name: "Pavilion Cabernet Sauvignon Napa Valley"
// num_merchants: 113
// num_reviews: 1
// price: "16.99"
// region: "USA > California > Napa"
// snoothrank: "n/a"
// tags: ""
// type: "Red Wine"
// varietal: "Cabernet Sauvignon"
// vintage: "2010"
// winery: "Pavilion WInery"
// winery_id: "pavilion-winery"

$(document).ready(function () {


  // 1. Initialize Firebase
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


  //snooth
  function buildQueryURL() {
    // queryURL is the url we'll use to query the API
    var queryURL = "http://api.snooth.com/wines/?";

    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = {
      "akey": "b0jsh3j9ckyksr2k5xu3t8mgd6tqs5wqcseanmyg1ikcnv9j",
      "q": "wine",
      "a": "0"
    };

    // Grab text the user typed into the search input, add to the queryParams object
    queryParams.color = $("#input-wine-color")
      .val()
      .trim();

    queryParams.vintage = $("#input-wine-year")
      .val()
      .trim();

    queryParams.region = $("#input-wine-region")
      .val()
      .trim();

    queryParams.n = $("#input-wine-count")
      .val()
      .trim();




    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
  }


  function updatePage(response) {
    var json = response;
    var parsed = JSON.parse(json)

    // Loop through and build elements for the defined number of wines
    for (var i = 0; i < parsed.wines.length; i++) {
      // Get specific wine info for current index
      // var wineName = parsed.wines[i].name;
      var winePrice = parsed.wines[i].price;
      var wineRegion = parsed.wines[i].region;
      var wineYear = parsed.wines[i].vintage;
      var wineColor = parsed.wines[i].type;

      // Increase the wineCount (track wine # - Yearing at 1)
      var wineCount = i + 1;

      // Create the  list group to contain the wines and add the wine content for each
      var $wineList = $("<ul>");
      $wineList.addClass("list-group");

      var $wineListItem = $("<li class='list-group-item wineHeadline'>");


      // Add the newly created element to the DOM
      $("#wine-section").append($wineList);
      $("#wine-section").append($wineListItem);

      // Creating a paragraph tag with the result item's properties
      // var pName = $("<p>").text("Wine Name: " + wineName);
      var pPrice = $("<p>").text("Wine Price: " + winePrice);
      var pRegion = $("<p>").text("Wine Region: " + wineRegion);
      var pColor = $("<p>").text("Wine Color: " + wineColor);
      var pYear = $("<p>").text("Wine Year: " + wineYear);


      // Appending the paragraph and image tag to the wineSection

      // $($wineListItem).append(pName);
      $($wineListItem).append(pPrice);
      $($wineListItem).append(pRegion);
      $($wineListItem).append(pColor);
      $($wineListItem).append(pYear);

    }
  }

  // Function to empty out the wine
  function clear() {
    $("#wine-section").empty();
  }

  // CLICK HANDLERS
  // ==========================================================

  // .on("click") function associated with the Search Button
  $("#run-search").on("click", function (event) {
    event.preventDefault();

    // Empty the region associated with the wines
    clear();

    // Grabs user input
    //    var wineName = $("#input-wine-name").val();
    var wineRegion = $("#input-wine-region").val();
    var wineYear = $("#input-wine-year").val();
    var wineType = $("#input-wine-color").val();

    // Creates local "temporary" object for holding wine data
    var newWine = {
      // name: wineName,
      region: wineRegion,
      year: wineYear,
      type: wineType
    };

    // Uploads Wine data to the database
    database.ref().push(newWine);

    // Logs everything to console
    // console.log(newWine.name);
    console.log(newWine.region);
    console.log(newWine.year);
    console.log(newWine.type);

    // Build the query URL for the ajax request to the NYT API
    var queryURL = buildQueryURL();

    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(updatePage);
  });

  // 3. Create Firebase event for adding wine to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var wineName = childSnapshot.val().name;
    var wineRegion = childSnapshot.val().region;
    var wineYear = childSnapshot.val().year;
    var wineType = childSnapshot.val().type;

    // wine Info
    console.log(wineName);
    console.log(wineRegion);
    console.log(wineYear);
    console.log(wineType);

    //Create the new row

    var newRow = $("<tr>").append(
      $("<td>").text(wineName),
      $("<td>").text(wineRegion),
      $("<td>").text(wineYear),
      $("<td>").text(wineType)
    );

    // Append the new row to the table
    $("#wine-table > tbody").append(newRow);

  });




  //  .on("click") function associated with the clear button
  $("#clear-all").on("click", clear);





  // begin login scripts
  var userExists = false;
  // is a user logged in?
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // if yes, show cellar
      $("#main-page").show();
      $("#sign-in-div").hide();
      $("#create-user-div").hide();
      var getName, getEmail;
      getName = "John Doe";
      getEmail = "email";
      console.log(user);
      user.updateProfile({
        displayName: getName,
        email: getEmail
      }).then(function () {
        // Update successful.
      }).catch(function (error) {
        // An error happened.
        window.alert(error);
      });
      console.log(user.displayName);

    } else {
      // if not show signin page
      $("#main-page").hide();
      $("#sign-in-div").show();
      $("#create-user-div").hide();
      $("#profile-div").hide();
    }
  });

  function signInToggle() {
    if (userExists) {
      $("#main-page").hide();
      $("#sign-in-div").show();
      $("#create-user-div").hide();
      userExists = false;
    } else {
      $("#main-page").hide();
      $("#sign-in-div").hide();
      $("#create-user-div").show();
      userExists = true;
    }

  }

  // login with Google account
  function googleLogin() {
    var googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(googleProvider);
  }

  // login with facebook
  function facebookLogin() {
    var facebookProvider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(facebookProvider);
  }

  // create user for wine-cellar app
  function createUser() {
    var email = $("#username-input-create").val();
    var password = $("#password-input-create").val();
    var newUserName = $("#name-field").val();
    console.log(email, password);
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
    });
    $("#username-input-create").val("");
    $("#password-input-create").val("");
    $("#name-field").val("");
  }

  // login with wine-cellar account
  function login() {
    var emailSign = $("#username-input").val();
    var passwordSign = $("#password-input").val();
    firebase.auth().signInWithEmailAndPassword(emailSign, passwordSign).catch(function (error) {
      // Handle Errors here.
      var errorCode2 = error.code;
      var errorMessage2 = error.message;
      window.alert(errorMessage2);
    });
    $("#username-input").val("");
    $("#password-input").val("");
  }

  function getProfile() {
    $("#create-profile-div").show();
    $("#main-page").hide();
    $("#sign-in-div").hide();
    $("#create-user-div").hide();
  }

  function manuallyUpdateProfile() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var username, email;
        if (checkbox.ischecked) {}
        user.updateProfile({
          displayName: username,
          email: email
        }).then(function () {
          // Update successful.
        }).catch(function (error) {
          // An error happened.
          window.alert(error);
        });
      } else {
        // if not show signin page
        $("#main-page").hide();
        $("#sign-in-div").show();
        $("#create-user-div").hide();
        $("#create-profile-div").hide();
      }
    });
  }

  function logout() {
    window.location = "index.html";
    firebase.auth().signOut();
  }

  function reset() {
    var auth = firebase.auth();
    var emailAddress = "user@example.com";

    auth.sendPasswordResetEmail(emailAddress).then(function () {
      // Email sent.
    }).catch(function (error) {
      // An error happened.
    });
  }

  $("#create-account-toggle").on("click", signInToggle);
  $("#sign-in-toggle").on("click", signInToggle);
  $("#sign-in").on("click", login);
  $("#create-user").on("click", createUser);
  $("#sign-in-google").on("click", googleLogin);
  $("#sign-in-facebook").on("click", facebookLogin);
  $("#logout").on("click", logout);
  $("#logout-profile").on("click", logout);
  // update profile click handler manuallyUpdateProfile
  // show profile click handler getProfile
  $("#reset-credentials").on("click", reset);

});