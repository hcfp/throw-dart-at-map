# Throw A Dart At A Map

This is an app build using NodeJS and ReactJS. It allows the user to throw a dart at a map and see where it lands and point them to any nearby cities or towns.

## How it works

### Client
- On the initial load, the users location is requested and the map is centered on that location.
- The map is rendered using the [Google Maps API](https://developers.google.com/maps/documentation/javascript) and a wrapper library [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api)
- When a user clicks the `THROW` button an API call is made to `/api/randomlocation` and data is received back from the server.
- The longitude and latitude of the random location is then used to place a marker on the map.
- The name of the nearby major locations are displayed along with their distance from where the dart landed.

### Server
- When the user clicks the `THROW` button, an API call is made to server at `/api/randomlocation`
- The server then makes a call to `https://api.3geonames.org/?randomland=yes&json=1`
    - This returns an JSON object containing a random location on Earth, a nearby named place and a nearby "major" location.
    - The random location is often unnamed and the coordinates of the major location are often incorrect, so only the nearby named location is used. 
- To get some more relevant major locations close to the random location another API call is made to `http://geodb-free-service.wirefreethought.com/v1/geo/locations/{latitute},{longitude}/nearbyCities?limit=5&offset=0&minPopulation=50000&radius=100&sort=-population`
    - This provides a list of nearby cities and towns with a population of 50,000 or more within 100KM. It is possible for none to be found.
    - If nearby major locations are found, the closest and most populous is used.
- The processed data from the two API calls is then combined into a single JSON object and returned to the client.

## TODO
- If we have the user's location, add the distance from the user to random location.
- Make markers clickable and display
- Make it look nice.