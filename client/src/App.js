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
    lat: 53.5769,
    lng: -2.4282
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
    console.log(location);
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

const LocationInfo = (props) => {
    return (
        <>
            <Nearest location={props.location.nearest} />
            <Major location={props.location.major} />
        </>
    )

}

const Nearest = (props) => {
    return <Typography variant="h6">{props.location.city}</Typography>
}

const Major = (props) => {
    return <Typography variant="h6">{props.location.city}</Typography>
}


const Markers = (props) => {
    if (props.nearest.lat === props.major.lat && props.nearest.lng === props.major.lng) {
        return <Marker position={props.nearest} />
    }
    else {
        return (
            <>
                <Marker position={props.nearest} label={"Nearest"} />
                <Marker position={props.major} label={"Major"} />
            </>
        )
    }
}

const Map = (props) => {
    let nearestCoords = center;
    let majorCoords = center;
    if (props.location) {
        nearestCoords = { lat: Number(props.location.nearest.latt), lng: Number(props.location.nearest.longt) };
        majorCoords = { lat: Number(props.location.major.latt), lng: Number(props.location.major.longt) };
    }

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyBCNGz2YRr-u5F5PVO-OXwX6lkz-or9Ud0"
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={nearestCoords}
                zoom={5}
            >
                <Markers nearest={nearestCoords} major={majorCoords} />
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