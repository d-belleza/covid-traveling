$(document).ready(function () {
    $(".parallax").parallax();
});


// datepicker initialize 
$(document).ready(function () {
    $(".datepicker").datepicker({
        autoClose: true,
        minDate: new Date(),
        format: "yyyy-mm-dd"
    });
});

$(document).ready(function () {
    $(".collapsible").collapsible();
});


// setting global variables
var startingLocation = "";
var endingLocation = "";
var outboundDate = "";
var inboundDate = "";
var savedTripsArray = [];

// Display intro modal on load
$(document).ready(function () {
    $('#modal').modal();
    $('#modal').modal('open');
});

// get search term when airport code search is submitted
$("#airport-search-btn").on("click", function (event) {
    event.preventDefault();

    var airportCodeSearch = $("#airport-search").val().trim()
    console.log(airportCodeSearch);

    if (airportCodeSearch === "") {
        M.toast({ html: 'Please enter city or country search criteria' })
    } else {
    getAirportOptions(airportCodeSearch);
    }
});

var getAirportOptions = function (airportCodeSearch) {

    var myHeaders = new Headers();
    myHeaders.append("x-rapidapi-key", "84e88edf43msh8f94761f7dfb087p1e1596jsn0ddf7fe493e7");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://tripadvisor1.p.rapidapi.com/airports/search?locale=en_US&query=" + airportCodeSearch, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayAirportInfo(data);
                });
            };
        })
        .catch(function () {
            M.toast({ html: 'ERROR: Please update your search information' })
        })
};

function displayAirportInfo(data) {
    $("#airport-code-section").removeClass("hide");
    // override previous search
    $("#airport-search").text("")
    // loop through all carriers

    // card title
    var newCard = $("<div>").addClass("card card-content blue3 white-text");
    // var cardTitle = $("<span>").addClass("card-title").text(data);
    // card table
    var addRow = $("<div>").addClass("row");
    var table = $("<table>").addClass("centered highlight blue3");
    var thead = $("<thead>").attr('id', 'thead');
    var trhead = $("<tr>").attr('id', 'trhead');
    var airportCodeTitle = $("<th>").text("Airport Code");
    var airportNameTitle = $("<th>").text("Airport Name");
    var locationTitle = $("<th>").text("City, Country");

    table.append(thead.append(trhead.append(airportCodeTitle, airportNameTitle, locationTitle)));
    addRow.append(table)

    newCard.append(addRow);
    $("#airport-options").html(newCard);

    for (var i = 0; i < data.length; i++) {
        var airportName = $("<td>").text(data[i].name);
        var airportCode = $("<td>").text(data[i].code);
        var cityName = $("<td>").text(data[i].city_name + ", " + data[i].country_code);
        var countryCode = $("<td>").text(data[i].country_code);
        var fullAirportInfo = $("<td>").text(data[i].display_name);
        var tbody = $("<tbody>").attr('id', 'tbody');
        var trbody = $("<tr>").attr('id', 'trbody');
        

        table.append(tbody.append(trbody.append(airportCode, airportName, cityName)));

    };
};

// get User Input when search is submitted

$("#submit-btn").on("click", function (event) {
    event.preventDefault();

    // save user inputs to variables
    startingLocation = $(".from-city").val().trim()
    endingLocation = $(".to-city").val().trim()
    outboundDate = $("#outbound-date").val().trim()
    inboundDate = $("#inbound-date").val().trim()

    // check for empty inputs
    if (startingLocation === "" || endingLocation === "") {
        M.toast({ html: 'Please select your locations' })
    }
    if (outboundDate === "" || inboundDate === "") {
        M.toast({ html: 'Please select your dates' })
    }
    if (inboundDate < outboundDate) {
        M.toast({ html: 'Inbound date must be after outbound date' })
    }
    if ((startingLocation != "") &
        (endingLocation != "") &
        (outboundDate != "") &
        (inboundDate != "") &
        (inboundDate > outboundDate)) {
        getTravelAdvice();
        getTravelQuotes();
    }
})


// fetch call for COVID Data
var getTravelAdvice = function () {

    var myHeaders = new Headers();
    myHeaders.append("X-Access-Token", "a9027f3b-807c-43e4-b30c-2e9f97ed1467");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    // adds user inputs into fetch call
    fetch("https://api.traveladviceapi.com/search/" + startingLocation + ":" + endingLocation + "," + endingLocation + ":" + startingLocation, requestOptions)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    addCountryData(data);
                });
            }
        })
        .catch(function () {
            M.toast({ html: 'ERROR: Unable to connect and gather COVID-19 data' })
        })
}

// load fetched data to page
function addCountryData(data) {
    // stop hiding data cards on right side of page
    $("#main-cards").removeClass("hide");
    $("#airport-code-section").addClass("hide");

    var newDiv = $("<div>").addClass("card-content white-text");
    var cityTitle = $("<h2>").addClass("card-title").text(data.Trips[0].LatestStats.country);

    // get note URL
    var urlRegex = /(https?:\/\/[^ ]*)/;
    var input = data.Trips[0].Advice.Notes[0].Note;
    var url = input.match(urlRegex)[1];
    var note = input.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

    // Add commas in numbers
    var newCases = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 10 }).format(data.Trips[0].LatestStats.new_cases);
    var totalCases = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 10 }).format(data.Trips[0].LatestStats.total_cases);
    var newDeaths = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 10 }).format(data.Trips[0].LatestStats.new_deaths);
    var totalDeaths = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 10 }).format(data.Trips[0].LatestStats.total_deaths);

    // Create COVID data elements
    var newCasesEl = $("<p>").text("New Cases: " + newCases);
    var totalCasesEl = $("<p>").text("Total Cases: " + totalCases);
    var newDeathsEl = $("<p>").text("New Deaths: " + newDeaths);
    var totalDeathsEl = $("<p>").text("Total Deaths: " + totalDeaths);
    var restrictionLevelEl = $("<p>").text("Restriction Level: " + data.Trips[0].Advice.News.Recommendation);
    var notesContainerEl = $("<p>");
    var restrictionNotesEl = $("<span>").text("Notes: " + note);
    var restrictionURLEl = $("<a />").text("More information >").attr("href", url).attr("target", "_blank");
    var lastUpdatedEl = $("<p>").text("Date of Information: " + new Date(data.Trips[0].LatestStats.date).toISOString().split('T')[0]);

    notesContainerEl.append(restrictionNotesEl, restrictionURLEl);
    $("#covid-data").html(newDiv.append(cityTitle).append(newCasesEl, totalCasesEl, newDeathsEl, totalDeathsEl, restrictionLevelEl, notesContainerEl, lastUpdatedEl));
}

// fetch call for flight options
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
                    getTravelOptions(data);
                });
            };
        })
        .catch(function () {
            M.toast({ html: 'ERROR: Unable to connect and gather flight routes' })
        })
};

// load flight options to page
function getTravelOptions(data) {
    var googleFlightUrl = ("https://www.google.com/flights?hl=en#flt=" + startingLocation + "." + endingLocation + "." + outboundDate + "*" + endingLocation + "." + startingLocation + "." + inboundDate + ";c:USD;e:1;sd:1;t:f");
    console.log(googleFlightUrl);
    // override previous search
    $("#flight-options").text("")

    // create link to Google Flight URL
    var flightUrl = $("#flight-btn").attr("href", googleFlightUrl).attr("target", "_blank");
    $("#flight-card-content").append(flightUrl);

    // loop through all carriers
    for (var i = 0; i < data.Carriers.length; i++) {
        console.log(data.Carriers[i].Name + ' flight price options:')
        // card title
        var newCard = $("<div>").addClass("card card-content blue3 white-text");
        var cardTitle = $("<span>").addClass("card-title").text(data.Carriers[i].Name);

        // card table
        var addRow = $("<div>").addClass("row");
        var table = $("<table>").addClass("centered highlight blue3");
        var thead = $("<thead>").attr('id', 'thead');
        var trhead = $("<tr>").attr('id', 'trhead').attr("href", googleFlightUrl).attr("target", "_blank");
        var priceTitle = $("<th>").text("Price");
        var directTitle = $("<th>").text("Direct flight");

        table.append(thead.append(trhead.append(priceTitle, directTitle)));
        addRow.append(table)

        newCard.append(cardTitle, addRow);
        $("#flight-options").append(newCard);

        var priceList = [];
        // loop through all quotes
        for (var j = 0; j < data.Quotes.length; j++) {
            // check for same carrier id
            if (data.Carriers[i].CarrierId === data.Quotes[j].OutboundLeg.CarrierIds[0]) {
                // if price is not repeated
                if (!priceList.includes(data.Quotes[j].MinPrice)) {
                    priceList.push(data.Quotes[j].MinPrice)
                    console.log("$" + data.Quotes[j].MinPrice + " Direct: " + data.Quotes[j].Direct)
                    // add prices and direct flight to table
                    var tbody = $("<tbody>").attr('id', 'tbody');
                    // var link = $("<a>").addClass("waves-effect waves-teal flat-").attr("href", googleFlightUrl);
                    var trbody = $("<tr>").attr('id', 'trbody');
                    var flightPrice = $("<td>").text("$" + data.Quotes[j].MinPrice);
                    var directFlight = $("<td>").attr('id', 'directFlight');
                    if (data.Quotes[j].Direct === true) {
                        directFlight.text("Yes");
                    } else {
                        directFlight.text("No");
                    }
                }

                table.append(tbody.append(trbody.append(flightPrice, directFlight)));
            }
        }
    }

}

// add trip to saved trips sidebar on click
$("#add-trip-btn").on("click", function () {

    var savedTripLi = $("<li>")
    var fixedOutboundDate = new Date(outboundDate).toISOString().split('T')[0];
    var fixedInboundDate = new Date(inboundDate).toISOString().split('T')[0];

    var savedTripLink = $("<a>").attr("href", "#").text(startingLocation + " " + endingLocation + " " + fixedOutboundDate + " " + fixedInboundDate);

    // save to saved trip info to an object
    var savedTripObj = {
        outboundCity: startingLocation,
        inboundCity: endingLocation,
        outboundDate: fixedOutboundDate,
        inboundDate: fixedInboundDate
    }


    // push that to savedTripsArray 
    savedTripsArray.push(savedTripObj);

    // save to local storage 
    localStorage.setItem("savedTrips", JSON.stringify(savedTripsArray));

    // append saved trip to page
    savedTripLi.append(savedTripLink);
    $(".saved-trips-list").append(savedTripLi);



})

// will load previously saved Trips to page
var loadSavedTrips = function () {
    // pull from local storage
    var savedTrips = JSON.parse(localStorage.getItem("savedTrips"));

    if (!savedTrips) {
        $(".saved-trips-list").html("");
        return;
    } else {
        // push to saved trips array 
        savedTripsArray = savedTrips;
        console.log(savedTripsArray);
        // create list element for each obj within saved Trips array
        for (var i = 0; i < savedTrips.length; i++) {
            var savedTripLi = $("<li>")
            var savedTripLink = $("<a>").attr("href", "#").text(savedTrips[i].outboundCity + " " + savedTrips[i].inboundCity + " " + savedTrips[i].outboundDate + " " + savedTrips[i].inboundDate);

            // append saved trip to page
            savedTripLi.append(savedTripLink);
            $(".saved-trips-list").append(savedTripLi);
        }
    }
}

// on button click, saved trips will be cleared
$("#clear-trips-btn").on('click', function () {
    localStorage.removeItem("savedTrips");
    loadSavedTrips();
})

$(".saved-trips-list").on('click', function (event) {
    event.preventDefault();
    var trip = event.target.text;
    var splitTripInfo = trip.split(" ");
    startingLocation = splitTripInfo[0];
    endingLocation = splitTripInfo[1];
    outboundDate = splitTripInfo[2];
    inboundDate = splitTripInfo[3];

    getTravelAdvice();
    getTravelQuotes();

})



// getTravelAdvice();
// getTravelQuotes();
// getAirportCode();
loadSavedTrips();