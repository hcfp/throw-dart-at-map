import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { AppBar, Typography, Toolbar, Button, Card, CardActions, CardContent, ThemeProvider, createTheme } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';

const MapContainerStyle = {
    width: '100%',
    height: '70vh',
};

const lightTheme = createTheme({
    palette: {
        primary: {
            main: '#90e6f9',
        },
        secondary: {
            main: '#f9a390',
        },
        background: {
            paper: '#f9a390'
        },
    },
});

const center = {
    lat: 53.5769,
    lng: -2.4282
};

const coordAPI = "/api/randomLocation";

const getRandomLocation = async () => {
    const response = await fetch(coordAPI, { method: 'GET' });
    const data = await response.json();
    return data;
}

const removeDuplicateLocations = (locations) => {
    if (locations.largest && locations.closestMajor) {
        if (locations.largest.id === locations.closestMajor.id) {
            locations.closestMajor = null;
        }
    }
    return locations;
}

function App() {
    const [locations, setLocations] = React.useState(null);

    const handleThrow = async () => {
        const randomLocation = await getRandomLocation();
        setLocations(removeDuplicateLocations(randomLocation));
    }
    return (
        <ThemeProvider theme={lightTheme} >
            <CssBaseline />
            <TitleBar />
            <main>
                <Card variant="outlined" sx={{ maxWidth: "75%", mx: "auto", mt: "10px" }}>
                    <CardContent>
                        <Map locations={locations} />
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" sx={{ margin: 'auto' }} size="large" onClick={handleThrow} endIcon={<SendTwoToneIcon />}>Throw a dart</Button>
                    </CardActions>
                </Card>
                {locations ? <LocationInfo locations={locations} /> : null}
            </main>
        </ThemeProvider>
    );
}

const getNameFromState = (state) => {
    if (typeof state === 'string' || state instanceof String) {
        let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
        return regionNames.of(state);
    }
    return null;
}

const CitiesInfo = (props) => {
    // Check if both exists
    if ((props.locations.largest && props.locations.closestMajor)) {
        // If they are the same, only display one
        if (props.locations.largest.id === props.locations.closestMajor.id) {
            return (
                <>
                    <Typography variant="h5">A nearby town or city is {props.locations.largest.name} with a population of {props.locations.largest.population.toLocaleString('en-uk')} ({props.locations.largest.distance}KM away)</Typography>
                </>
            )
        }
        else {
            return (
                <>
                    <Typography variant="h5">The largest nearby town or city is {props.locations.largest.name} with a population of {props.locations.largest.population.toLocaleString('en-uk')} ({props.locations.largest.distance}KM away)</Typography>
                    <Typography variant="h5">The closest major town or city is {props.locations.closestMajor.name} with a population of {props.locations.closestMajor.population.toLocaleString('en-uk')} ({props.locations.closestMajor.distance}KM away)</Typography>
                </>
            )
        }
    }

    // If neither exist display no nearby cities
    if (!props.locations.largest && !props.locations.closestMajor) {
        return <Typography variant="h5">No notable nearby towns or cities</Typography>
    }

    // Handle if only one exists
    if (props.locations.largest && !props.locations.closestMajor) {
        return <Typography variant="h5">The largest nearby town or city is {props.locations.largest.name} with a population of {props.locations.largest.population.toLocaleString('en-uk')} ({props.locations.largest.distance}KM away)</Typography>
    }
    return <Typography variant="h5">The closest town or city is {props.locations.closestMajor.name} with a population of {props.locations.closestMajor.population.toLocaleString('en-uk')} ({props.locations.closestMajor.distance}KM away)</Typography>
}

const LocationInfo = (props) => {
    const country = getNameFromState(props.locations.location.state);
    return (
        <Card variant="outlined" sx={{ maxWidth: "75%", mx: "auto", mt: "20px", textAlign: "center" }}>
            <CardContent>
                <Typography variant="h4" sx={{ mb: "20px" }}>Your dart landed near: {props.locations.location.city} {country ? "in " + country : null}</Typography>
                <CitiesInfo locations={props.locations} />
            </CardContent>
        </Card>
    )
}


const Map = (props) => {
    console.log(props);
    const [coords, setCoords] = React.useState(center);
    const [largestCoords, setLargestCoords] = React.useState(null);
    const [closestMajorCoords, setClosestMajorCoords] = React.useState(null);

    // get user location on first render only
    React.useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
        } else { console.log("User location not available"); }
    }, []);

    // if the location prop exists, set the coords to the location
    React.useEffect(() => {
        if (props.locations === null) return;
        if (props.locations.location) {
            setCoords({ lat: Number(props.locations.location.latt), lng: Number(props.locations.location.longt) });
        }
        if (props.locations.largest) {
            setLargestCoords({ lat: Number(props.locations.largest.latitude), lng: Number(props.locations.largest.longitude) });
        }
        if (props.locations.closestMajor) {
            setClosestMajorCoords({ lat: Number(props.locations.closestMajor.latitude), lng: Number(props.locations.closestMajor.longitude) });
        }
    }, [props.locations]);

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_API_KEY}
        >
            <GoogleMap
                mapContainerStyle={MapContainerStyle}
                center={coords}
                zoom={5}
            >
                <Marker position={coords} label={{ text: "🎯", fontSize: "30px" }} />
                largestCoords ? <Marker position={largestCoords} label={"Largest nearby town or city"} /> : null
                closestMajorCoords ? <Marker position={closestMajorCoords} label={"Closest nearby town or city"} /> : null
            </GoogleMap>
        </LoadScript>
    )
}

function TitleBar() {
    return (
        <AppBar position="relative">
            <Toolbar>
                <TravelExploreIcon sx={{ fontSize: '55px' }} />
                <Typography variant="h2" sx={{ flexGrow: 1 }}>Throw a Dart at a Map</Typography>
                <FlightTakeoffIcon fontSize="large" />
                <Typography variant="h6" sx={{ mx: 2 }}>Put trust in the dart and see where it takes you</Typography>
                <FlightLandIcon fontSize="large" />
            </Toolbar>
        </AppBar>
    );
}

export default React.memo(App);