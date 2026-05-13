
// Community key for Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiYXA3MCIsImEiOiJjbW9sbzloYzkwanNpMzJuY3R6dmM1YXJqIn0.cV6sTCW9ZRJPtXHX8zpMaw';

const map = new mapboxgl.Map({
    container : 'map', // container ID
    style : 'mapbox://styles/mapbox/dark-v11', //style URl link
    center: [-122.2, 37.78],
    zoom: 10
});

// Community key for BART API
const bartKey = "MW9S-E7SL-26DU-VV8V";

//using the offical BART data to find the choords for each station, then adding a marker to the map for each station
const stationCoords = {
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

// Object for station names so that we don't have to fetch them
const stationNames = {
    "12th" : "12th St. Oakland City Center",
    "16th" : "16th St. Mission (SF)",
    "19th" : "19th St. Oakland",
    "24th" : "24th St. Mission (SF)",
    "ashb" : "Ashby (Berkeley)",
    "antc" : "Antioch",
    "balb" : "Balboa Park (SF)",
    "bayf" : "Bay Fair (San Leandro)",
    "bery" : "Berryessa / North San Jose",
    "cast" : "Castro Valley",
    "civc" : "Civic Center (SF)",
    "cols" : "Coliseum",
    "colm" : "Colma",
    "conc" : "Concord",
    "daly" : "Daly City",
    "dbrk" : "Downtown Berkeley",
    "dubl" : "Dublin/Pleasanton",
    "deln" : "El Cerrito del Norte",
    "plza" : "El Cerrito Plaza",
    "embr" : "Embarcadero (SF)",
    "frmt" : "Fremont",
    "ftvl" : "Fruitvale (Oakland)",
    "glen" : "Glen Park (SF)",
    "hayw" : "Hayward",
    "lafy" : "Lafayette",
    "lake" : "Lake Merritt (Oakland)",
    "mcar" : "MacArthur (Oakland)",
    "mlbr" : "Millbrae",
    "mlpt" : "Milpitas",
    "mont" : "Montgomery St. (SF)",
    "nbrk" : "North Berkeley",
    "ncon" : "North Concord/Martinez",
    "oakl" : "Oakland Int'l Airport",
    "orin" : "Orinda",
    "pitt" : "Pittsburg/Bay Point",
    "pctr" : "Pittsburg Center",
    "phil" : "Pleasant Hill",
    "powl" : "Powell St. (SF)",
    "rich" : "Richmond",
    "rock" : "Rockridge (Oakland)",
    "sbrn" : "San Bruno",
    "sfia" : "San Francisco Int'l Airport",
    "sanl" : "San Leandro",
    "shay" : "South Hayward",
    "ssan" : "South San Francisco",
    "ucty" : "Union City",
    "warm" : "Warm Springs/South Fremont",
    "wcrk" : "Walnut Creek",
    "wdub" : "West Dublin",
    "woak" : "West Oakland"
}

// Bart line colors
const BARTlines = {
    yellow: "#FFD800",
    red:    "#E53935",
    blue:   "#2196F3",
    green:  "#43A047",
    orange: "#FF6D00",
    beige:  "#BCAAA4"
};

//BART route GEOJSON, basically simplified lines for each route, used to draw the lines on the map

const bartRoutes = {
    type: "FeatureCollection",
    features: [
        {
             type: "Feature",
            properties: { line: "yellow", color: BARTlines.yellow, "basewidth": 14 },
            geometry: {
                type: "LineString",
                coordinates: [
                    stationCoords["antc"], stationCoords["pctr"], stationCoords["pitt"],
                    stationCoords["ncon"], stationCoords["conc"], stationCoords["phil"],
                    stationCoords["wcrk"], stationCoords["lafy"], stationCoords["orin"],
                    stationCoords["rock"], stationCoords["mcar"], stationCoords["19th"],
                    stationCoords["12th"], stationCoords["woak"], stationCoords["embr"], 
                    stationCoords["mont"], stationCoords["powl"], stationCoords["civc"], 
                    stationCoords["16th"], stationCoords["24th"], stationCoords["glen"], 
                    stationCoords["balb"], stationCoords["daly"], stationCoords["colm"], 
                    stationCoords["ssan"], stationCoords["sbrn"], stationCoords["sfia"]
                    ]
            }
        },
        {
            type: "Feature",
            properties: { line: "red", color: BARTlines.red, "basewidth": 12 },
            geometry: {
                type: "LineString",
                coordinates: [
                    stationCoords["rich"], stationCoords["deln"], stationCoords["plza"],
                    stationCoords["nbrk"], stationCoords["dbrk"], stationCoords["ashb"],
                    stationCoords["mcar"], stationCoords["19th"], stationCoords["12th"],
                    stationCoords["woak"], stationCoords["embr"], stationCoords["mont"],
                    stationCoords["powl"], stationCoords["civc"], stationCoords["16th"],
                    stationCoords["24th"], stationCoords["glen"], stationCoords["balb"],
                    stationCoords["daly"], stationCoords["colm"], stationCoords["ssan"],
                    stationCoords["sbrn"], stationCoords["sfia"], stationCoords["mlbr"]
                ]
            }
        },
        {
             type: "Feature",
            properties: { line: "blue", color: BARTlines.blue, "basewidth": 12 },
            geometry: {
                type: "LineString",
                coordinates: [
                    stationCoords["dubl"], stationCoords["wdub"], stationCoords["cast"],
                    stationCoords["bayf"], stationCoords["sanl"], stationCoords["cols"], 
                    stationCoords["ftvl"], stationCoords["lake"], stationCoords["woak"],
                    stationCoords["embr"], stationCoords["mont"], stationCoords["powl"],
                    stationCoords["civc"], stationCoords["16th"], stationCoords["24th"],
                    stationCoords["glen"], stationCoords["balb"], stationCoords["daly"]
                ]
            }
        },
        {
              type: "Feature",
            properties: { line: "green", color: BARTlines.green, "basewidth": 14 },
            geometry: {
                type: "LineString",
                coordinates: [
                    stationCoords["bery"], stationCoords["mlpt"], stationCoords["warm"],
                    stationCoords["frmt"], stationCoords["ucty"], stationCoords["shay"],
                    stationCoords["hayw"], stationCoords["bayf"], stationCoords["sanl"],
                    stationCoords["cols"], stationCoords["ftvl"], stationCoords["lake"],
                    stationCoords["woak"], stationCoords["embr"], stationCoords["mont"],
                    stationCoords["powl"], stationCoords["civc"], stationCoords["16th"],
                    stationCoords["24th"], stationCoords["glen"], stationCoords["balb"],
                    stationCoords["daly"]
                ]
            }
        },
        {
            type: "Feature",
            properties: { line: "orange", color: BARTlines.orange, "basewidth": 18 },
            geometry: {
                type: "LineString",
                coordinates: [
                    stationCoords["bery"], stationCoords["mlpt"], stationCoords["warm"],
                    stationCoords["frmt"], stationCoords["ucty"], stationCoords["shay"],
                    stationCoords["hayw"], stationCoords["bayf"], stationCoords["sanl"],
                    stationCoords["cols"], stationCoords["ftvl"], stationCoords["lake"],
                    stationCoords["12th"], stationCoords["19th"], stationCoords["mcar"],
                    stationCoords["ashb"], stationCoords["dbrk"], stationCoords["nbrk"],
                    stationCoords["plza"], stationCoords["deln"], stationCoords["rich"]
                ]
            }
        },
        {
             type: "Feature",
            properties: { line: "beige", color: BARTlines.beige, "basewidth": 8 },
            geometry: {
                type: "LineString",
                coordinates: [
                    stationCoords["oakl"], stationCoords["cols"]
                ]
            }
        }

    ]
};

// Current stations
let station1 = "";
let station2 = "";

// Enum for readability in future functions
const stationNum = {k1: "station1", k2: "station2" };

// Station 1 elements
let nameElement = document.getElementById("name");
let locationElement = document.getElementById("location");
let arrivalElement = document.getElementById("arrival");
let etdElement = document.getElementById("etd");
let etaElement = document.getElementById("eta");

// Station 2 Elements
let nameElement2 = document.getElementById("name2");
let locationElement2 = document.getElementById("location2");

// Fare elements
let standardFareElement = document.getElementById("clipper");
let seniorFareElement = document.getElementById("rtcclipper");
let studentFareElement = document.getElementById("student");
let affordableFareElement = document.getElementById("start");

// Transfer elements
let transferElement = document.getElementById("transfers")

// Popup elements
const popup1Element = document.getElementById("popup1");
const popup2Element = document.getElementById("popup2");

// Adding map layers and markers as the map loads
map.on('load', () => {
    map.addSource('bart-routes', { type: 'geojson', data: bartRoutes });
 
    map.addLayer({
        id: 'bart-lines',
        type: 'line',
        source: 'bart-routes',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
            'line-color': ['get', 'color'],
            'line-width': [
                'interpolate', ['linear'], ['zoom'],
                8, ["*", ["get", "basewidth"], 0.5],
                14, ["get", "basewidth"]
            ],
            'line-opacity': 0.75
        }
    });
 
    // --- Add a station marker for each station ---
    Object.entries(stationCoords).forEach(([id, coords]) => {
        // Create a styled marker element
        const el = document.createElement('div');
        el.className = 'bart-marker';
        el.setAttribute('data-id', id);
        el.style.padding = '7px'; // Expands clickable area
 
        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
            .setLngLat(coords)
            .addTo(map);
 
        el.addEventListener('click', () => handleStationClick(id));
    });
});

// Station click handling (Or it might be a handler)
function handleStationClick(stationId) {

    // enable when no popup is active
    if (popup1Element.hasAttribute("hidden")) {

        station1 = stationId;
        getLocationInfo(station1, stationNum.k1);
        getArrivalInfo(station1, stationNum.k1);
        popup1Element.toggleAttribute("hidden");
        hideTransfers();
        hideArrivalTime();
    
    // enable when first popup is active
    } else if (popup2Element.hasAttribute("hidden")){
        station2 = stationId;

        if (station1 === station2){
            station2 = "";
            hidePopUps();

        } else {
            getLocationInfo(station2, stationNum.k2);
            getFare(station1, station2);
            getRoute(station1, station2);
            popup2Element.toggleAttribute("hidden");
        }

    //hide both popups 
    } else {
        hidePopUps();
        hideTransfers();
        hideArrivalTime();
    }
}

// Gets address and name
async function getLocationInfo(station, stationNum) {

    let response = await fetch(`https://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=${station}&key=${bartKey}&json=y`);
    let parsed = await response.json();
    let address = parsed.root.stations.station.city + ", " + parsed.root.stations.station.address;
    
    if (stationNum == "station1"){
        nameElement.textContent     = stationNames[station];
        locationElement.textContent = address;
    } else {
        nameElement2.textContent     = stationNames[station];
        locationElement2.textContent = address;
    }
}

// Gets the next (major) train departure
async function getArrivalInfo(station) {
    if (station == "oakl") {
        getRoute("oakl", "cols");
    } else {
        let response = await fetch(`https://api.bart.gov/api/etd.aspx?cmd=etd&orig=${station}&key=${bartKey}&json=y`);
        let parsed = await response.json();
        let destinations = parsed.root.station[0].etd;

        let leastIndex = destinations.length - 1;
        for (let i = 0; i < destinations.length; i++) {
            if (Number(destinations[i].estimate[0].minutes) < Number(destinations[leastIndex].estimate[0].minutes)) {
                leastIndex = i;
            } 

            if (destinations[leastIndex].estimate[0].minutes == "Leaving") {
                etdElement.textContent = "Now"
            } else {
                etdElement.textContent = destinations[leastIndex].estimate[0].minutes + " minutes";
            }

            arrivalElement.textContent = destinations[leastIndex].destination;   
        }
    }
}

// Gets all fares for the trip
async function getFare(station1ID, station2ID) {
    let response = await fetch(`https://api.bart.gov/api/sched.aspx?cmd=fare&orig=${station1ID}&dest=${station2ID}&date=today&key=${bartKey}&json=y`);
    let parsed = await response.json();
    
    let fares = parsed.root.fares.fare;

    let fareElements = document.getElementsByClassName("fare");

    for (i = 0; i < fareElements.length; i++) {fareElements[i].textContent = "Loading..."}

    for (i = 0; i < fareElements.length; i++) {

        for (y = 0; y < fares.length; y++) {

            if (fareElements[i].getAttribute("id") == fares[y]["@class"]) {
                fareElements[i].textContent = "$" + fares[y]["@amount"];
                break;
            }

        }

        if (fareElements[i].textContent == "Loading...") {
            fareElements[i].textContent = "N/A"
        }

    }

}

// Gets the specific route selected and the times associated with it
async function getRoute(station1ID, station2ID) {
    let response = await fetch(`https://api.bart.gov/api/sched.aspx?cmd=depart&orig=${station1ID}&dest=${station2ID}&date=now&key=${bartKey}&b=0&a=1&l=0&json=y`);
    let parsed = await response.json();
    
    let sTrip = parsed.root.schedule.request.trip;
    
    if (Array.isArray(sTrip)) {
        arrivalElement.textContent = stationNames[sTrip[sTrip.length-1]["@destination"].toLowerCase()];
        etdElement.textContent = sTrip[sTrip.length-1]["@origTimeMin"];
        etaElement.textContent = "Time arriving: " + sTrip[sTrip.length-1]["@destTimeMin"];
        transferElement.textContent += getTransfers(sTrip[sTrip.length-1]);
    } else {
        arrivalElement.textContent = stationNames[sTrip["@destination"].toLowerCase()];
        etdElement.textContent = sTrip["@origTimeMin"];
        etaElement.textContent = "Time arriving: " + sTrip["@destTimeMin"]
        transferElement.textContent += getTransfers(sTrip);
    }

}

// Gets the transfers for the selected route
function getTransfers(sTrip) {
    result = "";

    if (sTrip.leg.length > 1) {
        result = "Transfers: " + stationNames[sTrip.leg[0]["@origin"].toLowerCase()]

        let incrementor = 0;

        // Exception handling for Oakland Airport
        if (sTrip.leg[0]["@origin"].toLowerCase() == "oakl") {
            result += " > " + stationNames["cols"];
            incrementor++;
        } 

        for (incrementor; incrementor < sTrip.leg.length; incrementor++) {
            result += " > " + stationNames[sTrip.leg[incrementor]["@destination"].toLowerCase()]
        }

        transferElement.setAttribute("hidden", false);
    }

    return result
}

// Hides both popups with one function call
function hidePopUps() {
    popup1Element.setAttribute("hidden", true);
    popup2Element.setAttribute("hidden", true);
}

// Clears and therefore hides transfers
function hideTransfers() {
    transferElement.textContent = ""
}

// Clears and therefore hides arrival time
function hideArrivalTime() {
    etaElement.textContent = ""
}