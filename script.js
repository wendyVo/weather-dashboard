 var cities = [];
 var APIKey = "218d683cbf2e7058f072e07e91703e04";
 //Functions for displaying current weather info
 function displayCurrentWeather(searchCity) {
     var searchCity = $("#city-input").val().trim();
     //  var city = $(this).attr("data-name");
     // This is our API key
     var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=" + APIKey;

     $.ajax({
         url: queryURL,
         method: "GET"
     }).then(function(response) {
         //  $("#current-forecast").text(JSON.stringify(response));
         //Get City
         var cityName = response.name;
         //Get current date
         var today = new Date(response.dt * 1000).toLocaleDateString();
         //Get icons
         var currentIcon = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

         // Creating an element to have the rating displayed
         var pOne = $("<h2>").html(cityName + " (" + today + ")" + "<img src=" + currentIcon + ">");
         $("#current-forecast").append(pOne);

         //Get current temperature from K to F
         var currentTemp = (response.main.temp - 273.15) * 1.80 + 32;
         var tempP = $("<p>").html("Temperature: " + (currentTemp).toFixed(2) + "&#8457");
         $("#current-forecast").append(tempP);

         //Get Humidity
         var HumP = $("<p>").html("Humidity: " + response.main.humidity + "%");
         $("#current-forecast").append(HumP);

         //Get Wind Speed
         var windP = $("<p>").html("Wind Speed: " + response.wind.speed + " MPH");
         $("#current-forecast").append(windP);

         //Get UV Index
         var lat = response.coord.lat;
         var lon = response.coord.lon
         UvIndex(lat, lon);

         //Get 5 days forecast
         var cityId = response.id;
         fiveForecast(cityId);

     })
 };
 //Function for UV index
 function UvIndex(lat, lon) {
     var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;;
     $.ajax({
         url: UVQueryURL,
         method: "GET"
     }).then(function(response) {
         var uv = response.value;
         //Check color for UV, if it's red, UV is very or extreme high, If it's green, UV is low, If it's orange, UV is high
         if (uv >= 8) {
             var currentUV = $("<p>").html("UV Index: " + '<span class="uvRed">' + uv + "</span>");
         } else if (uv <= 5) {
             var currentUV = $("<p>").html("UV Index: " + '<span class="uvGreen">' + uv + "</span>");
         } else {
             var currentUV = $("<p>").html("UV Index: " + '<span class="uvOrange">' + uv + "</span>");
         }
         $("#current-forecast").append(currentUV);
     });
 }

 //Function for 5 days forecast
 function fiveForecast(cityId) {
     var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityId + ",us&APPID=" + APIKey;
     $.ajax({
         url: forecastURL,
         method: "GET"
     }).then(function(response) {
         for (i = 0; i < 5; i++) {
             var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
             var iconForecast = response.list[((i + 1) * 8) - 1].weather[0].icon;
             var iconURL = "https://openweathermap.org/img/wn/" + iconForecast + ".png";
             var tempK = response.list[((i + 1) * 8) - 1].main.temp;
             var tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
             var humForecast = response.list[((i + 1) * 8) - 1].main.humidity;

             console.log(date);
             console.log(iconURL);
             console.log(tempF);
             console.log(humForecast);
             //  $("#fiveDayForeCast" + i).html(date);
             //  $("#fImg" + i).html("<img src=" + iconUrl + ">");
             //  $("#fTemp" + i).html(tempF + "&#8457");
             //  $("#fHumidity" + i).html(humForeCast + "%");
         }
     });


 }

 //Function for displaying city data in history
 function renderHistory() {
     //Deleting the search input text prior to add city
     $("#search-history").empty();
     for (var i = 0; i < cities.length; i++) {
         var li = $("<li>");
         li.addClass("list-group-item");
         // Adding a data-attribute
         li.attr("data-name", cities[i]);
         // Providing the initial search text
         li.text(cities[i]);
         // Adding the clicked event to the search history div
         $("#search-history").append(li);
     }
 }

 //When the Search Button clicked
 $("#add-city").on("click", function(event) {
     event.preventDefault();

     //This line grabs the input from the textbox
     var city = $("#city-input").val().trim();

     //adding the city input from the textbox to our array
     cities.push(city);
     console.log(cities);


     //calling renderHistory which handles the processing of array
     renderHistory();
 });

 function updateCurrentWeather(data) {

 }

 //Function for displaying the city info
 $(document).on("click", ".list-group-item", displayCurrentWeather);

 renderHistory();