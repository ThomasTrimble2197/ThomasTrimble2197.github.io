
// Community key (replace with personal key later)
mapboxgl.accessToken = 'pk.eyJ1IjoiYXA3MCIsImEiOiJjbW9sbzloYzkwanNpMzJuY3R6dmM1YXJqIn0.cV6sTCW9ZRJPtXHX8zpMaw';

const map = new mapboxgl.Map({
    container : 'map', // container ID
    style : 'mapbox://styles/mapbox/dark-v11', //style URl link
    center: [-122.2, 37.78],
    zoom: 10
});

const bartKey = "MW9S-E7SL-26DU-VV8V";

//using the offical BART data to find the choords for each station, then adding a marker to the map for each station
const stationchords = {
     "12th": [-122.2719, 37.8033],
    "16th": [-122.4197, 37.7651],
    "19th": [-122.2688, 37.8080],
    "24th": [-122.4183, 37.7524],
    "ashb": [-122.2699, 37.8530],
    "antc": [-121.7807, 37.9956],
    "balb": [-122.4474, 37.7229],
    "bayf": [-122.1268, 37.6970],
    "bery": [-121.8742, 37.3753],
    "cast": [-122.0851, 37.6907],
    "civc": [-122.4148, 37.7795],
    "cols": [-122.1974, 37.7539],
    "colm": [-122.4661, 37.6845],
    "conc": [-122.0290, 37.9737],
    "daly": [-122.4703, 37.7062],
    "dbrk": [-122.2680, 37.8698],
    "dubl": [-121.9000, 37.7016],
    "deln": [-122.3172, 37.9253],
    "plza": [-122.2998, 37.9018],
    "embr": [-122.3969, 37.7929],
    "frmt": [-121.9766, 37.5573],
    "ftvl": [-122.2243, 37.7746],
    "glen": [-122.4338, 37.7330],
    "hayw": [-122.0878, 37.6703],
    "lafy": [-122.1239, 37.8934],
    "lake": [-122.2665, 37.7977],
    "mcar": [-122.2670, 37.8283],
    "mlbr": [-122.3867, 37.5996],
    "mlpt": [-121.8907, 37.4141],
    "mont": [-122.4019, 37.7893],
    "nbrk": [-122.2833, 37.8741],
    "ncon": [-122.0256, 38.0030],
    "oakl": [-122.2197, 37.7130],
    "orin": [-122.1834, 37.8784],
    "pitt": [-121.9454, 37.9965],
    "pctr": [-121.8883, 37.9948],
    "phil": [-122.0572, 37.9282],
    "powl": [-122.4073, 37.7844],
    "rich": [-122.3531, 37.9368],
    "rock": [-122.2513, 37.8444],
    "sbrn": [-122.4160, 37.6373],
    "sfia": [-122.3927, 37.6159],
    "sanl": [-122.1609, 37.7224],
    "shay": [-122.0570, 37.6347],
    "ssan": [-122.4076, 37.6639],
    "ucty": [-122.0173, 37.5908],
    "warm": [-121.9397, 37.5019],
    "wcrk": [-122.0674, 37.9049],
    "wdub": [-121.9282, 37.6997],
    "woak": [-122.2946, 37.8046]
};

//Bart line colors
const BARTlines = {
    yellow: "#FFD800",
    red:    "#E53935",
    blue:   "#2196F3",
    green:  "#43A047",
    orange: "#FF6D00",
    beige:  "#BCAAA4"
};

//BART route GEOJSON, basically simplifyd lines for each route, used to draw the lines on the map

// Enum for readability in future functions
const stationNum = {
    k1: "station1",
    k2: "station2"
}

// Station 1 elements
let nameElement = document.getElementById("name");
let locationElement = document.getElementById("location");
let arrivalElement = document.getElementById("arrival");
let goingToElement = document.getElementById("goingto");
let etdElement = document.getElementById("etd");
let fareElement = document.getElementById("fare");

// Station 2 Elements
let nameElement2 = document.getElementById("name2");
let locationElement2 = document.getElementById("location2");

//Overlay element
const overlay = document.getElementById("overlay");

// Popup elements
const popup1Element = document.getElementById("popup1");
const popup2Element = document.getElementById("popup2");

// Current station info (might not be needed, may remove later)
let sName = "";
let address = "";
let nextArrival = "";
let nextArrivalTime = "";
let finalArrival = "";
let cost = "";

// Gets all station buttons...
const stations = document.getElementsByClassName("station");

for (let i = 0; i < stations.length; i++) {

    // ... and makes them wait for a click
    stations[i].addEventListener("click", function() {

        // if popup 1 isnt open, then set popup to info of associated station
        if (popup1Element.hasAttribute("hidden")) {
            
            station1 = stations[i].getAttribute("id");

            getLocationInfo(station1, stationNum.k1);
            getArrivalInfo(station1, stationNum.k1);

            popup1Element.toggleAttribute("hidden");
        }

        // if popup 1 is open, but popup 2 isn't, then...
        else if (popup2Element.hasAttribute("hidden")) {
            
            station2 = stations[i].getAttribute("id");
            
            //...check to see if user clicked on the same button. if so, hide all popups
            if (station1 == station2) {
                station2 = ""
                hidePopUps();
            
            // otherwise, set popup2 to info of associated station
            } else {
                getLocationInfo(station2, stationNum.k2);
                // getArrivalInfo(station2, stationNum.k2);
                popup2Element.toggleAttribute("hidden");
            }
            
        }
        // if both popups are open, then hide all popups
        else {
            hidePopUps();
        }
        window.addEventListener("click", event => { 
        //Check if the click was on the overlay (the background)    
        if (event.target === overlay) {
            hidePopUps();
    }});
 });

}

// Gets basic location info, the station name and the address

async function getLocationInfo(station, stationNum) {
    let response = await fetch(`https://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=${station}&key=${bartKey}&json=y`);

    let parsed = await response.json();

    sName = parsed.root.stations.station.name;

    address = String(parsed.root.stations.station.city + ", " + parsed.root.stations.station.address);

    //using enum info, writes data to approiate place
    if (stationNum == "station1") {
        nameElement.textContent = sName;
        locationElement.textContent = address;
    } else {
        nameElement2.textContent = sName;
        locationElement2.textContent = address;
    }
    
}


// This DESPERATELY needs to be corrected with the proper info
// Gets the next train departure

async function getArrivalInfo(station, stationNum) {
    let response = await fetch(`https://api.bart.gov/api/etd.aspx?cmd=etd&orig=${station}&key=${bartKey}&json=y`);

    let parsed = await response.json();

    let destinations = parsed.root.station[0].etd;

    let leastIndex = destinations.length-1;

    console.log(destinations)

    for (let i = 0; i < destinations.length; i++) {
        if (Number(destinations[i].estimate[0].minutes) < Number(destinations[leastIndex].estimate[0].minutes)) {
            leastIndex = i
        }
    }

    nextArrival = destinations[leastIndex].destination;
    nextArrivalTime = destinations[leastIndex].estimate[0].minutes;

    etdElement.textContent = nextArrivalTime + " minutes";
    arrivalElement.textContent = nextArrival;
}

// Hides both popups with one function call
function hidePopUps() {
    popup1Element.setAttribute("hidden", true);
    popup2Element.setAttribute("hidden", true);
}

