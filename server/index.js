const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const coordURL = "https://api.3geonames.org/?randomland=yes&json=1";

const getNearbyCities = async (lat, lng) => {
    let cityRequest = "http://geodb-free-service.wirefreethought.com/v1/geo/locations/"

    lat >= 0 ? cityRequest += "+" + lat : cityRequest += lat;
    lng >= 0 ? cityRequest += "+" + lng : cityRequest += lng;
    cityRequest += "/nearbyCities?limit=5&offset=0&minPopulation=50000&radius=100&sort=-population"
    const response = await fetch(cityRequest, { method: 'GET' });
    const data = await response.json();

    let dataArray = data.data;
    console.log("Nearby places", dataArray);
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
    console.log("location", data);
    return data.nearest;
}

app.get("/api/randomLocation", async (req, res) => {
    const location = await getRandomLocation();
    const cities = await getNearbyCities(location.latt, location.longt);
    const locationCities = { location: location, ...cities };
    console.log("Final", locationCities);
    res.json(locationCities);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});