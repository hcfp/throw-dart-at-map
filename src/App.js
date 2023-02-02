import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { AppBar, Typography, Toolbar, Button, Card, CardActions, CardContent, ThemeProvider, createTheme } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';

const containerStyle = {
    width: '100%',
    height: '75vh',
    margin: 'auto',
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    }
});
const center = {
    lat: 53.5769,
    lng: -2.4282
};

const card = (
    <React.Fragment>
        <CardContent>
            <Map />
        </CardContent>
        <CardActions>
            <Button variant="contained" sx={{ margin: 'auto' }} size="large">Throw</Button>
        </CardActions>
    </React.Fragment>
);

function App() {
    return (
        <ThemeProvider theme={lightTheme} >
            <CssBaseline />
            <TitleBar />
            <main>
                <Typography variant="h3" align="center">Throw a dart and see where it lands</Typography>
                <Card variant="outlined" sx={{ maxWidth: "75%", mx: "auto" }}>{card}</Card>
            </main>
        </ThemeProvider >
    );
}

function Map() {
    return (
        <LoadScript
            googleMapsApiKey="AIzaSyBCNGz2YRr-u5F5PVO-OXwX6lkz-or9Ud0"
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            >
                <></>
            </GoogleMap>
        </LoadScript>
    )
}

function TitleBar() {
    return (
        <AppBar position="relative">
            <Toolbar>
                <TravelExploreIcon fontSize="large" />
                <Typography variant="h4">Throw a Dart at a Map</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default React.memo(App)