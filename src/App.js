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


const coordURL = "https://api.3geonames.org/?randomland=yes&json=1";

const getRandomCoords = async () => {
    // fetch data from coordURL
    const response = await fetch(coordURL, { method: 'GET' });
    const data = await response.json();
    return {lat: Number(data.nearest.latt), lng: Number(data.nearest.longt)};
}

function App() {
    const [coords, setCoords] = React.useState(center);

    const handleThrow = async () => {
        console.log("Throwing a dart at a map");
        const randCoords = await getRandomCoords();
        setCoords(randCoords);
    }
    
    return (
        <ThemeProvider theme={lightTheme} >
            <CssBaseline />
            <TitleBar />
            <main>
                <Card variant="outlined" sx={{ maxWidth: "75%", mx: "auto", mt: "20px" }}>
                    <CardContent>
                        <Map coords={coords} />
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" sx={{ margin: 'auto' }} size="large" onClick={handleThrow}>Throw</Button>
                    </CardActions>
                </Card>
            </main>
        </ThemeProvider >
    );
}

const Map = (props) => {
    console.log(props.coords);
    return (
        <LoadScript
            googleMapsApiKey="AIzaSyBCNGz2YRr-u5F5PVO-OXwX6lkz-or9Ud0"
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={props.coords}
                zoom={5}
            >
                <>
                    <Marker position={props.coords} />
                </>
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