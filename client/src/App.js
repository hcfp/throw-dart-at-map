import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { AppBar, Typography, Toolbar, Button, Card, CardActions, CardContent, ThemeProvider, createTheme } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';

const containerStyle = {
    width: '100%',
    height: '75vh',
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

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
    lat: -26.235277777,
    lng: +28.37
};

const coordAPI = "/api/randomLocation";

const getRandomLocation = async () => {
    const response = await fetch(coordAPI, { method: 'GET' });
    const data = await response.json();
    return data;
}

function App() {
    const [location, setLocation] = React.useState(null);

    const handleThrow = async () => {
        const randomLocation = await getRandomLocation();
        setLocation(randomLocation);
    }
    return (
        <ThemeProvider theme={lightTheme} >
            <CssBaseline />
            <TitleBar />
            <main>
                <Card variant="outlined" sx={{ maxWidth: "75%", mx: "auto", mt: "20px" }}>
                    <CardContent>
                        <Map location={location} />
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" sx={{ margin: 'auto' }} size="large" onClick={handleThrow}>Throw</Button>
                    </CardActions>
                </Card>
                {location ? <LocationInfo location={location} /> : null}
            </main>
        </ThemeProvider>
    );
}

const getNameFromState = (state) => {
    if (state) {
        let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
        return regionNames.of(state);
    }
    return null;
}

const CitiesInfo = (props) => {
    // Check if both exists
    if ((props.location.largest && props.location.closestMajor)) {
        // If they are the same, only display one
        if (props.location.largest.id === props.location.closestMajor.id) {
            return (
                <>
                    <Typography variant="h5">A nearby town or city is {props.location.largest.name} with a population of {props.location.largest.population} ({props.location.largest.distance}KM away)</Typography>
                </>
            )
        }
        else {
            return (
                <>
                    <Typography variant="h5">The largest nearby town or city is {props.location.largest.name} with a population of {props.location.largest.population} ({props.location.largest.distance}KM away)</Typography>
                    <Typography variant="h5">The closest major town or city is {props.location.closestMajor.name} with a population of {props.location.closestMajor.population} ({props.location.closestMajor.distance}KM away)</Typography>
                </>
            )
        }
    }

    // If neither exist display no nearby cities
    if (!props.location.largest && !props.location.closestMajor) {
        return <Typography variant="h5">No notable nearby town or cities</Typography>
    }

    // Handle if only one exists
    if (props.location.largest && !props.location.closestMajor) {
        return <Typography variant="h5">The largest nearby town or city is {props.location.largest.name} with a population of {props.location.largest.population} ({props.location.largest.distance}KM away)</Typography>
    }
    return <Typography variant="h5">The closest town or city is {props.location.closestMajor.name} with a population of {props.location.closestMajor.population} ({props.location.closestMajor.distance}KM away)</Typography>
}

const LocationInfo = (props) => {
    const country = getNameFromState(props.location.location.state);
    return (
        <Card variant="outlined" sx={{ maxWidth: "75%", mx: "auto", mt: "20px" }}>
            <CardContent>
                <Typography variant="h4" sx={{ mb: "20px" }}>Your dart landed near: {props.location.location.city} {country ? "in " + country : null}</Typography>
                <CitiesInfo location={props.location} />
            </CardContent>
        </Card>
    )
}

const Map = (props) => {
    let coords = center
    if (props.location) {
        coords = { lat: Number(props.location.location.latt), lng: Number(props.location.location.longt) };
    }
    return (
        <LoadScript
            googleMapsApiKey="AIzaSyBCNGz2YRr-u5F5PVO-OXwX6lkz-or9Ud0"
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={coords}
                zoom={5}
            >
                <Marker position={coords} />
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

export default React.memo(App)