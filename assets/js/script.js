// Starting and Ending Locations should be Airport Codes
var startingLocation = "LHR";
var endingLocation = "DFW";
// Dates should be in the format below from the calendar input
var outboundDate = "2020-07-06";
var inboundDate = "2020-07-15";

// Display intro modal on load
$(document).ready(function(){
    $('#modal').modal();
    $('#modal').modal('open'); 
});


var getTravelAdvice = function () {
    var myHeaders = new Headers();
    myHeaders.append("X-Access-Token", "a9027f3b-807c-43e4-b30c-2e9f97ed1467");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://api.traveladviceapi.com/search/" + startingLocation + ":" + endingLocation, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    // var totalPopulation = data.Trips[0].LatestStats.population;
                    // console.log(totalPopulation);
                    // // Console for the New Cases
                    // var newCases = $("<p>").addClass("new-button m-2 p-1").text(data.Trips[0].LatestStats.new_cases + " New Cases");
                    // console.log(newCases + " New Cases");
                    // // Console for the Total Cases
                    // var totalCases = data.Trips[0].LatestStats.total_cases;
                    // console.log(totalCases + " Total Cases");
                    // // Console for the New Deaths
                    // var newDeaths = data.Trips[0].LatestStats.new_deaths;
                    // console.log(newDeaths + " New Deaths");
                    // // Console for the Total Deaths
                    // var totalDeaths = data.Trips[0].LatestStats.total_deaths;
                    // console.log(totalDeaths + " Total Deaths");
                    // // Console for the Restriction Level
                    // console.log(data.Trips[0].Advice.News.Recommendation);
                    // // Console for Notes for Restriction Level
                    // console.log(data.Trips[0].Advice.Notes[0].Note);

                    addCountryData(data);
                });
            };
        });
}

function addCountryData (data) {

    var newDiv = $("<div>").addClass("card-content white-text");
    var cityTitle = $("<span>").addClass("card-title").text(data.Trips[0].To + " " + new Date(data.Trips[0].Date).toLocaleDateString('en-US'));

    var newCases = $("<p>").text("New Cases: " + data.Trips[0].LatestStats.new_cases);
    var totalCases = $("<p>").text("Total Cases: " + data.Trips[0].LatestStats.total_cases);
    var newDeaths = $("<p>").text("New Deaths: " + data.Trips[0].LatestStats.new_deaths);
    var totalDeaths = $("<p>").text("Total Deaths: " + data.Trips[0].LatestStats.total_deaths);
    var restrictionLevel = $("<p>").text("Restriction Level: " + data.Trips[0].Advice.News.Recommendation);
    var restrictionNotes = $("<p>").text("Notes: " + data.Trips[0].Advice.Notes[0].Note);
    var lastUpdated = $("<p>").text("Last Updated: " + new Date(data.Trips[0].LatestStats.date).toLocaleDateString('en-US'));

    // var addTripDiv = $("<div>").addClass("card blue darken-4 white-text card-action");
    var savedTripBtn = $("<a>").addClass("btn-floating blue lighten-1").text("Add to Saved Trips");
    var savedTripIcon = $("<i>").addClass("material-icons").text("add");
    
    $("#covid-data").html(newDiv.append(cityTitle).append(newCases, totalCases, newDeaths, totalDeaths, restrictionLevel, restrictionNotes, lastUpdated));

    $("#saved-trips-btn").append(savedTripIcon).append(savedTripBtn);

}

var getTravelQuotes = function () {
    var myHeaders = new Headers();
    myHeaders.append("x-rapidapi-key", "84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/" + startingLocation + "-sky/" + endingLocation + "-sky/" + outboundDate + "?inboundpartialdate=" + inboundDate, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    for (var i = 0; i < data.Carriers.length; i++) {
                        for (var j = 0; j < data.Quotes.length; j++) {
                            if (data.Carriers[i].CarrierId === data.Quotes[j].OutboundLeg.CarrierIds[0]) {
                                console.log(data.Carriers[i].Name + " has a minimum price of $" + data.Quotes[j].MinPrice);
                            }
                        }
                    }
                });
            };
        });
};

// var getUrlQuotes = function () {

//     var myHeaders = new Headers();
//     myHeaders.append("x-rapidapi-key", "84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7");

//     var requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         redirect: 'follow'
//     };

//     fetch("https://tripadvisor1.p.rapidapi.com/flights/create-session?currency=USD&ta=1&c=0&d1=" + endingLocation + "&o1=" + startingLocation + "&dd1=" + outboundDate, requestOptions)
//         .then(function (response) {
//             if (response.ok) {
//                 response.json().then(function (data) {
//                     console.log(data);
//                 });
//             };
//         });
// }

getTravelAdvice();
getTravelQuotes();
// getUrlQuotes();