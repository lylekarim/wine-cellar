$(document).ready(function() {

  function updatePage(response) {
    console.log(response);
    var parsed = JSON.parse(response);
    console.log(parsed);

    // Loop through and build elements for the defined number of wines
    for (var i = 0; i < parsed.wines.length; i++) {
      // Get specific wine info for current index
      var wineName = parsed.wines[i].name;
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
      var pName = $("<p>").text("Wine Name: " + wineName);
      var pPrice = $("<p>").text("Wine Price: " + winePrice);
      var pRegion = $("<p>").text("Wine Region: " + wineRegion);
      var pColor = $("<p>").text("Wine Color: " + wineColor);
      var pYear = $("<p>").text("Wine Year: " + wineYear);

      // Appending the paragraph and image tag to the wineSection

      $($wineListItem).append(pName);
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


  // 3. Create Firebase event for adding wine to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    // Store everything into a variable.
    var wineName = childSnapshot.val().name;
    var wineRegion = childSnapshot.val().region;
    var wineYear = childSnapshot.val().year;
    var wineType = childSnapshot.val().type;

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
});
