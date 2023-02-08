const express = require("express");
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const coordURL = "https://api.3geonames.org/?randomland=yes&json=1";

const getNearbyCities = async (lat, lng) => {
    let cityRequest = "http://geodb-free-service.wirefreethought.com/v1/geo/locations/"

    lat >= 0 ? cityRequest += "+" + lat : cityRequest += lat;
    lng >= 0 ? cityRequest += "+" + lng : cityRequest += lng;
    cityRequest += "/nearbyCities?limit=5&offset=0&minPopulation=50000&radius=100&sort=-population"
    const response = await fetch(cityRequest, { method: 'GET' });
    const data = await response.json();

    let dataArray = data.data;
    //console.log("Nearby places", dataArray);
    let largestNearbyCity = null;
    let closestNearbyCity = null;
    if (dataArray.length !== 0) {
        largestNearbyCity = data.data[0];
        closestNearbyCity = dataArray.reduce(function (prev, curr) {
            return prev.distance < curr.distance ? prev : curr;
        });
    }

    return { largest: largestNearbyCity, closestMajor: closestNearbyCity };
}

const getRandomLocation = async () => {
    const response = await fetch(coordURL, { method: 'GET' });
    const data = await response.json();
    //console.log("location", data);
    return data.nearest;
}

function haversine_distance(coords1, coords2) {
    var R = 6357; // Radius of the Earth in KM
    var radiansLat1 = coords1.lat * (Math.PI / 180); // Convert degrees to radians
    var radiansLat2 = coords2.lat * (Math.PI / 180); // Convert degrees to radians
    var diffLat = radiansLat2 - radiansLat1; // Radian difference (latitudes)
    var diffLon = (coords2.lng - coords1.lng) * (Math.PI / 180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(diffLat / 2) * Math.sin(diffLat / 2) + Math.cos(radiansLat1) * Math.cos(radiansLat2) * Math.sin(diffLon / 2) * Math.sin(diffLon / 2)));
    return d;
}

const getDistance = (coords1, coords2) => {
    return haversine_distance(coords1, coords2).toFixed(2);
}

app.post("/api/distance", async (req, res) => {
    console.log(req.body);
    distance = getDistance(req.body.coords1, req.body.coords2);
    console.log(distance);
    res.json(getDistance(req.body.coords1, req.body.coords2));
});

app.get("/api/randomLocation", async (req, res) => {
    const location = await getRandomLocation();
    const cities = await getNearbyCities(location.latt, location.longt);
    const locationCities = { location: location, ...cities };
    //console.log("Final", locationCities);
    res.json(locationCities);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});