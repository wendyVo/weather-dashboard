$(document).ready(function() {
    //Global variables
    var APIKey = "218d683cbf2e7058f072e07e91703e04";

    //When the Search Button clicked
    $("#add-city").on("click", function(event) {
        event.preventDefault();

        //This line grabs the input from the textbox
        var citySearch = $("#city-input").val().trim();
        //empty the search box after click button
        $("#city-input").val("");

        currentWeather(citySearch);
        fiveDayForecast(citySearch)
    });

    //create row function for history
    function makeRow(value) {
        var li = $("<li>");
        li.addClass("list-group-item");
        li.text(value);
        $("#search-history").append(li);
    }

    //search current weather
    function currentWeather(citySearch) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + APIKey;
        $.ajax({
            type: "GET",
            url: queryURL,
            dataType: "json",
            success: function(data) {
                //history link for the search
                if (historySearch.indexOf(citySearch) === -1) {
                    historySearch.push(citySearch);
                    window.localStorage.setItem("historySearch", JSON.stringify(historySearch));

                    makeRow(citySearch);
                }

                //clear previous content from current weather
                $("#current-forecast").empty();

                //set variable for current day
                var today = new Date(data.dt * 1000).toLocaleDateString();

                //create html for current weather
                var title = $("<h2>").addClass("card-title").text(data.name + " (" + today + ")");
                var card = $("<div>").addClass("card currentDiv");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
                var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
                var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + "°F");
                var cardBody = $("<div>").addClass("card-body");
                var img = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

                //merge and add to current weather page
                title.append(img);
                cardBody.append(title, temp, humid, wind);
                card.append(cardBody);
                $("#current-forecast").append(card);

                //Get UV Index
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;;
                $.ajax({
                    url: UVQueryURL,
                    method: "GET"
                }).then(function(data) {
                    var uv = data.value;
                    console.log("uv: " + uv)
                        //Check color for UV, if it's red, UV is very or extreme high, If it's green, UV is low, If it's orange, UV is high
                    if (uv >= 8) {
                        var currentUV = $("<p>").addClass("card-text").html("UV Index: " + '<span class="uvRed">' + uv + "</span>");
                    } else if (uv <= 5) {
                        var currentUV = $("<p>").addClass("card-text").html("UV Index: " + '<span class="uvGreen">' + uv + "</span>");
                    } else {
                        var currentUV = $("<p>").addClass("card-text").html("UV Index: " + '<span class="uvOrange">' + uv + "</span>");
                    }
                    cardBody.append(currentUV);


                });

                //Get 5 days Forecast
                var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&appid=" + APIKey;
                //Five day forecast API call
                $.ajax({
                    url: fiveDayURL,
                    method: "GET"
                }).then(function(response) {
                    console.log(response);
                    var forecastList = response.list;
                    //refresh the page when loading forecast
                    $("#fiveDayForeCast").empty();
                    //build html for five day forecasts
                    //because in forecast five day, each list is increased by 3 hours. 
                    //therefore, for a new day, need to increase 8 times 3* 8 = 24 hrs

                    var cardDeck = $("<div>").addClass("card-deck forecastDiv");
                    var forecastTitle = $("<h2>").addClass("ftitle").text("5-day Forecast");
                    for (var i = 4; i < forecastList.length; i += 8) {
                        //creating a div
                        var fiveDayCard = $("<div>").addClass("card fiveCard");
                        // var fiveDay = new Date(forecastList[i] * 1000).toLocaleDateString();
                        var fiveDay = moment(forecastList[i].dt_txt.split(" ")[0]).format('DD/MM/YYYY');
                        var fiveImg = $("<img>").addClass("card-text").attr("src", "https://openweathermap.org/img/wn/" + forecastList[i].weather[0].icon + "@2x.png");
                        var fiveTemp = $("<p>").addClass("card-text").text("Temp: " + forecastList[i].main.temp + "°F");
                        var fiveHumid = $("<p>").addClass("card-text").text("Humidity: " + forecastList[i].main.humidity + "%");
                        console.log(fiveDay);
                        var dayTitle = $("<h5>").addClass("card-title").text(fiveDay);
                        fiveDayCard.append(dayTitle, fiveImg, fiveTemp, fiveHumid);
                        cardDeck.append(fiveDayCard);
                        $("#fiveDayForeCast").append(forecastTitle, cardDeck);
                        console.log(dayTitle);
                    }
                });

            }
        })
    }


    //set variable and render for search history
    var historySearch = JSON.parse(window.localStorage.getItem("historySearch")) || [];
    console.log("History's Length:", historySearch.length);

    if (historySearch.length > 0) {
        currentWeather(historySearch[historySearch.length - 1]);
    }

    for (var i = 0; i < historySearch.length; i++) {
        makeRow(historySearch[i]);
    }
    //make the history search clickable
    $("#search-history").on("click", "li", function() {
        currentWeather($(this).text());
    });


});