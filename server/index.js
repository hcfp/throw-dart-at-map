const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const coordURL = "https://api.3geonames.org/?randomland=yes&json=1";

const getRandomCoords = async () => {
    const response = await fetch(coordURL, { method: 'GET' });
    const data = await response.json();;
    return {lat: Number(data.nearest.latt), lng: Number(data.nearest.longt)};
}

app.get("/api/randomCoords", async (req, res) => {
    const coords = await getRandomCoords();
    res.json(coords);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});