import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { AppBar, Typography, Toolbar, Button, Card, CardActions, CardContent, ThemeProvider, createTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import './index.css';

const MapContainerStyle = {
    width: '100%',
    height: '70vh',
};

const themeLight = createTheme({
    palette: {
        background: {
            default: "#001220"
        }
    }
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
    const [userCoords, setUserCoords] = React.useState(null);

    React.useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
        } else { console.log("User location not available"); }
    }, []);

    const handleThrow = async () => {
        const randomLocation = await getRandomLocation();
        setLocations(removeDuplicateLocations(randomLocation));
    }
    return (
        <ThemeProvider theme={themeLight}>
        <CssBaseline>
            <main>
                <div className="wavesBackground layer1">
                    <Typography variant="h1" className="mainTitle" textAlign="center" sx={{ textShadow: "1px 1px #DCDCDC"}}>Throw a Dart at a Map</Typography>
                    <Typography variant="h4" textAlign="center" className="mainTitle">Travel the world, one dart at a time</Typography>
                    <a href="#dartMap"><KeyboardArrowDownIcon style={{ color: "white", fontSize: "64px" }} className="downIcon" /></a>
                </div>
                <div style={{ background: themeLight.palette.primary.mainGradient }}>
                <section id="dartMap">
                    <Card variant="outlined" sx={{ maxWidth: "75%", mx: "auto", mt: "10px", mb:"30px"}}>
                        <CardContent>
                            <Map locations={locations} />
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" sx={{ margin: 'auto' }} size="large" onClick={handleThrow} endIcon={<SendTwoToneIcon />}>Throw a dart</Button>
                        </CardActions>
                    </Card>
                </section>
                <section>
                    {locations ? <LocationInfo locations={locations} userCoords={userCoords} /> : null}
                </section>
                </div>
            </main>
        </CssBaseline>
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
    const { largest, closestMajor } = props.locations;

    // If neither exist display no nearby cities
    if (!largest && !closestMajor) {
        return <Typography variant="h5">No notable nearby towns or cities</Typography>
    }

    // If both exist display both
    if ((largest && closestMajor)) {
        return (
            <>
                <Typography variant="h5">The largest nearby town or city is {largest.name} with a population of {largest.population.toLocaleString('en-uk')} ({largest.distance}KM away from dart)</Typography>
                <Typography variant="h5">The closest major town or city is {closestMajor.name} with a population of {closestMajor.population.toLocaleString('en-uk')} ({closestMajor.distance}KM away from dart)</Typography>
            </>
        )
    }
    // Handle if only one exists
    if (largest && !closestMajor) {
        return <Typography variant="h5">The largest nearby town or city is {largest.name} with a population of {largest.population.toLocaleString('en-uk')} ({largest.distance}KM away from dart)</Typography>
    }
    return <Typography variant="h5">The closest town or city is {closestMajor.name} with a population of {closestMajor.population.toLocaleString('en-uk')} ({closestMajor.distance}KM away from dart)</Typography>
}

const LocationInfo = (props) => {
    const location = props.locations.location;
    const country = getNameFromState(location.state);
    const [distance, setDistance] = React.useState(null);

    React.useEffect(() => {
        const getDistanceFromLocation = async () => {
            const response = await fetch('/api/distance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "coords1": props.userCoords, "coords2": { lat: Number(location.latt), lng: Number(location.longt) } })
            })
            const distanceToMarker = await response.json();
            console.log(distanceToMarker);
            setDistance(distanceToMarker);
        }
        getDistanceFromLocation();
    }, [props.locations, location, props.userCoords])
    return (
        <Card variant="outlined" sx={{ maxWidth: "75%", mx: "auto", mt: "20px", textAlign: "center" }}>
            <CardContent>
                <Typography variant="h4" sx={{ mb: "20px" }}>Your dart landed near: {location.city} {country ? "in " + country : null} ({distance}KM away)</Typography>
                <CitiesInfo locations={props.locations} />
            </CardContent>
        </Card>
    )
}


const Map = (props) => {
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
        // destructuring props.locations
        if (props.locations === null) return;
        const { location, largest, closestMajor } = props.locations;
        if (props.locations.location) {
            setCoords({ lat: Number(location.latt), lng: Number(location.longt) });
        }
        if (props.locations.largest) {
            setLargestCoords({ lat: Number(largest.latitude), lng: Number(largest.longitude) });
        }
        else {
            setLargestCoords(null);
        }
        if (props.locations.closestMajor) {
            setClosestMajorCoords({ lat: Number(closestMajor.latitude), lng: Number(closestMajor.longitude) });
        }
        else {
            setClosestMajorCoords(null);
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
                <Marker position={coords} label={{ text: "🎯", fontSize: "36px" }} />
                largestCoords ? <Marker position={largestCoords} label={{ text: "Largest nearby town or city", fontWeight: "bold", fontSize: "18px" }} /> : null
                closestMajorCoords ? <Marker position={closestMajorCoords} label={{ text: "Closest nearby town or city", fontWeight: "bold", fontSize: "18px" }} /> : null
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(App);