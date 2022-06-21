var APIkey = "ee07bab17b41b2da7ac951ed7415d112"
var cityList =$("#city-list");
var cities = [];
  
function getWeather(city){
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +city + "&appid=" + APIkey; 
$("#weather-forecast").empty();
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    cityTitle = $("<h3>").text(response.name + " "+ FormatDay());
    $("#weather-forecast").append(cityTitle);
var cityDegree = parseInt((response.main.temp)* 9/5 - 459);
var cityTemperature = $("<p>").text("Tempeture: "+ cityDegree + " °F");
    $("#weather-forecast").append(cityTemperature);
var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
    $("#weather-forecast").append(cityHumidity);
var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
    $("#weather-forecast").append(cityWindSpeed);
var CoordLon = response.coord.lon;
var CoordLat = response.coord.lat;
    

var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid="+ APIkey + "&lat=" + CoordLat +"&lon=" + CoordLon;
$.ajax({
    url: queryURL2,
    method: "GET"
}).then(function(weatherUV) {
var cityUV = $("<span>").text(weatherUV.value);
var cityUVp = $("<p>").text("UV Index: ");
    cityUVp.append(cityUV);
    $("#weather-forecast").append(cityUVp);
    console.log(typeof weatherUV.value);
        if(weatherUV.value > 0 && weatherUV.value <=2){
            cityUV.attr("class","lowUV")
        }
        else if (weatherUV.value > 2 && weatherUV.value <= 5){
            cityUV.attr("class","mediumUV")
        }
        else if (weatherUV.value >5 && weatherUV.value <= 7){
            cityUV.attr("class","highUV")
        }
        else if (weatherUV.value >7 && weatherUV.value <= 10){
            cityUV.attr("class","veryhighUV")
        }
        else {
            cityUV.attr("class","exthighUV")
         }
        });
    
var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;
    $.ajax({
    url: queryURL3,
    method: "GET"
    }).then(function(response5day) { 
        $("#boxes").empty();
        console.log(response5day);
    for(var i=0, j=0; j<=5; i=i+6){
var read_date = response5day.list[i].dt;
    if(response5day.list[i].dt != response5day.list[i+1].dt){
var fiveDayForcast = $("<div>");
    fiveDayForcast.attr("class","col-3 m-2 bg-primary")
var d = new Date(0); 
    d.setUTCSeconds(read_date);
var date = d;
    console.log(date);
var month = date.getMonth()+1;
var day = date.getDate();
var dayOutput = date.getFullYear() + '/' +
    (month<10 ? '0' : '') + month + '/' +
    (day<10 ? '0' : '') + day;
var fiveDayText = $("<h4>").text(dayOutput);
var imgtag = $("<img>");
var skyconditions = response5day.list[i].weather[0].main;
    if(skyconditions==="Clouds"){
        imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
    } else if(skyconditions==="Clear"){
        imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
    }else if(skyconditions==="Rain"){
        imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
    }

var pTemperatureK = response5day.list[i].main.temp;
    console.log(skyconditions);
var cityDegree = parseInt((pTemperatureK)* 9/5 - 459);
var pTemperature = $("<p>").text("Tempeture: "+ cityDegree + " °F");
var pHumidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + " %");
    fiveDayForcast.append(fiveDayText);
    fiveDayForcast.append(imgtag);
    fiveDayForcast.append(pTemperature);
    fiveDayForcast.append(pHumidity);
    $("#boxes").append(fiveDayForcast);
        console.log(response5day);
        j++;
        }
    }
    });
});
}


function cityHistory(){
  localStorage.setItem("cities", JSON.stringify(cities));
  console.log(localStorage);
}


function renderCities() {
    cityList.empty();
    
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var li = $("<li>").text(city);
        li.attr("id","listC");
        li.attr("data-city", city);
        li.attr("class", "list-group-item");
        console.log(li);
        cityList.prepend(li);
    }
    if (!city){
        return
    } 
    else {
        getWeather(city)
    };
}   


$("#add-city").on("click", function(event){
    event.preventDefault();

    var city = $("#city-input").val().trim();
    
    if (city === "") {
        return;
    }
    cities.push(city);
cityHistory();
renderCities();
});


$(document).on("click", "#listC", function() {
    var thisCity = $(this).attr("data-city");
    getWeather(thisCity);
});


function FormatDay(date){
    var date = new Date();
    console.log(date);
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    var dayOutput = date.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;
    return dayOutput;
}


function init(){
    var storedCities = JSON.parse(localStorage.getItem("cities"));
        if (storedCities !== null) {
            cities = storedCities;
        }

    renderCities();
}

init();