const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const coordURL = "https://api.3geonames.org/?randomland=yes&json=1";

const getRandomLocation = async () => {
    const response = await fetch(coordURL, { method: 'GET' });
    const data = await response.json();
    return {nearest: data.nearest, major: data.major};
}

app.get("/api/randomLocation", async (req, res) => {
    const location = await getRandomLocation();
    res.json(location);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});