$(document).ready(function () {
  var curPage = localStorage.getItem("currentPage");
  var wineReturned;
  var userID;
  var userName;
  var arrayOfStores;
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
  function buildQueryURL(input) {
    // queryURL is the url we'll use to query the API
    var queryURL = "http://api.snooth.com/wines/?";

    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = {
      akey: "b0jsh3j9ckyksr2k5xu3t8mgd6tqs5wqcseanmyg1ikcnv9j",
      q: input.name,
      color: input.type,
      n: 10
    };

    return queryURL + $.param(queryParams);
  }
  //This sets up the api call for the stores in the users area
  function storeURL(input) {
    var storeQuery = "https://api.snooth.com/stores/?";

    // Begin building an object to contain our API call's query parameters
    // Set the API key
    var queryParams = {
      akey: "b0jsh3j9ckyksr2k5xu3t8mgd6tqs5wqcseanmyg1ikcnv9j",
      c: "US",
      z: $("#zip-code").val()
    };
    return storeQuery + $.param(queryParams);
  }

  $("#run-search").on("click", function (event) {
    event.preventDefault();

    var storeLocationURL = storeURL();
    console.log(storeLocationURL);
    //This will call the local stores and save the results in the an array
    $.ajax({
      url: storeLocationURL,
      method: "GET"
    }).then(function (response) {
      arrayOfStores = JSON.parse(response);
      console.log(arrayOfStores);
    });
    //Then when the array is created the following api will use the store ids to build a button to check its availability

    var wineType = $("#input-wine-color").val();
    var wineName = $("#input-wine-name").val();

    var holdingObject = {
      name: wineName,
      type: wineType
    };
    var queryURL = buildQueryURL(holdingObject);

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      wineReturned = JSON.parse(response);
      //console.log(wineReturned);
      //console.log("hello");
      updatePage(wineReturned.wines);
    });
  });

  //This will add the returned wines to a table the user can select from
  function updatePage(input) {
    console.log("update page");

    for (var i = 0; i < input.length; i++) {
      console.log(input[i]);
      var fillInRow = $("<tr>");
      fillInRow.attr("data-name", input[i].name);

      var wineNameTD = $("<td>");
      wineNameTD.attr("class");
      wineNameTD.text(input[i].name);

      var wineVintageTD = $("<td>");
      if (input[i].vintage.length > 2) {
        wineVintageTD.text(input[i].vintage);
      } else {
        wineVintageTD.text("Not Available");
      }

      var inputNumber = $("<input>");
      inputNumber.attr("type", "number");
      inputNumber.attr("id", "name-" + i);
      inputNumber.attr("class", i);
      var selectedNumber = $("<td>").append(inputNumber);

      var selectBtn = $("<button>");
      selectBtn.attr("class", "chosenWine " + i);
      selectBtn.attr("data-wine", i);
      selectBtn.text("Select");
      var selectBTNTD = $("<td>").append(selectBtn);

      fillInRow.append(wineNameTD, wineVintageTD, selectedNumber, selectBTNTD);
      $("#wineReturned").append(fillInRow);
    }
  }

  //This is the location search that pulls the users location and searchs local stores for this wine
  $(document).on("click", ".locationSearch", function (event) {
    event.preventDefault();
    var searchZ = prompt("What zip code? : ");


  })


  function updateDatabase(userID, wine, amount) {
    var updates = {
      amount: amount,
      wineCode: wine.code,
      varietal: wine.varietal,
      image: wine.image,
      name: wine.name
    };
    database.ref("users/" + userID).push(updates);
  }
  //this adds the chosen wine and number of bottles to a users cellar
  $(document).on("click", ".chosenWine", function (event) {
    event.preventDefault();

    //Needs to pull the data from the row for the wine info
    //returned wines are saved until a new search is initiated
    //allows for continual references back
    var working = $(this).attr("data-wine");
    var wineWorking = wineReturned.wines[working];
    var bottlesToAdd = $("#name-" + working).val();
    updateDatabase(userID, wineWorking, bottlesToAdd);
  });

  //this will populate the cellar in the profile.html
  function thisFuckingThing() {
    if (curPage === "cellar") {
      database.ref("/users/" + userID).once("value", function (snapshot) {
        var i = 0;
        snapshot.forEach(function (childSnapshot) {
          console.log("thisfuckingthing");
          console.log(childSnapshot.val().key);
          var fillInRow = $("<tr>");
          fillInRow.attr("data-name", "cellarRow " + i);

          var wineNameTD = $("<td>");
          wineNameTD.text(childSnapshot.val().name);

          var wineVarietal = $("<td>");
          wineVarietal.text(childSnapshot.val().varietal);

          var increaseBtn = $("<button>");
          increaseBtn.attr("class", "btn btn-submit increase " + i);
          increaseBtn.text("+");

          var decreaseBtn = $("<button>");
          decreaseBtn.attr("class", "btn btn-submit decrease " + i);
          decreaseBtn.text("-");

          var bottles = $("<td>");
          bottles.attr("class", "bottleOWine")
          bottles.append(increaseBtn);
          bottles.append(`<p>${childSnapshot.val().amount}<p>`);
          bottles.append(decreaseBtn);

          var selectBtn = $("<button>");
          selectBtn.attr("class", "locationSearch " + i);
          selectBtn.attr("data-wine", i);
          selectBtn.text("Location");
          var location = $("<td>").append(selectBtn);

          fillInRow.append(wineImg, wineNameTD, wineVarietal, bottles, location);

          $("#wineCellar").append(fillInRow);
          i++;
        });
      });
    }
  }

  // Function to empty out the wine
  function clear() {
    $("#wine-section").empty();
  }

  // begin login scripts
  var userExists = false;
  // is a user logged in?
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // if yes, show cellar
      $("#main-page").show();
      $("#sign-in-div").hide();
      $("#create-user-div").hide();
      console.log(user);
      userID = user.uid;
      userName = user;
      thisFuckingThing();
      fillHomePage();
      database
        .ref()
        .once("value")
        .then(function (snapshot) {
          console.log(userID);
          console.log("lettuce");
          if (!snapshot.child("users/" + userID).exists()) {
            console.log("testing2");
            database
              .ref()
              .child("users/")
              .child(user.uid)
              .set({
                name: user.displayName
              });
          }
        });

      //passes userID  out to global scope


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

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function (error) {
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
    firebase
      .auth()
      .signInWithEmailAndPassword(emailSign, passwordSign)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode2 = error.code;
        var errorMessage2 = error.message;
        window.alert(errorMessage2);
      });
    $("#username-input").val("");
    $("#password-input").val("");
  }

  function manuallyUpdateProfile() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var username, email;
        if (checkbox.ischecked) {}
        user
          .updateProfile({
            displayName: username,
            email: email
          })
          .then(function () {
            // Update successful.
          })
          .catch(function (error) {
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
    var userToReset = firebase.auth().currentUser;
    var auth = firebase.auth();
    var emailAddress = userToReset.email;

    auth
      .sendPasswordResetEmail(emailAddress)
      .then(function () {
        // Email sent.
        window.alert("Password reset email has been sent.");
      })
      .catch(function (error) {
        // An error happened.
        window.alert(error);
      });
  }

  function fillHomePage() {
    if (curPage === "index") {
      database.ref('/users/' + userID).once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var newWine = childSnapshot.val().name;
          var newVarietal = childSnapshot.val().varietal;
          var newRow = $("<tr>").append(
            $("<td>").text(newWine),
            $("<td>").text(newVarietal)
          );
          console.log(newRow);
          $("#wine-table").append(newRow);
        });
      });
    }
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
  $("#update-profile").on("click", manuallyUpdateProfile);
});