import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import React, { useEffect, useState } from 'react';

export default function Directions({ route }) {
    const startLocation = { lat: parseFloat(route.stops[0].latitude), lng: parseFloat(route.stops[0].longitude) };
    const endLocation = { lat: parseFloat(route.stops[route.stops.length - 1].latitude), lng: parseFloat(route.stops[route.stops.length - 1].longitude) };

    const stopoverPoints = route.stops.slice(1, route.stops.length - 1).map(stop => {
        return { location: { lat: parseFloat(stop.latitude), lng: parseFloat(stop.longitude) }, stopover: true };
    });
    const googleMapInstance = useMap();
    const mapsAPI = useMapsLibrary("routes");
    const [directionServiceInstance, setDirectionServiceInstance] = useState(null);
    const [directionsRendererInstance, setDirectionsRendererInstance] = useState(null);

    useEffect(() => {
        if (!mapsAPI || !googleMapInstance || !window.google) return;
        setDirectionServiceInstance(new window.google.maps.DirectionsService());
        setDirectionsRendererInstance(new window.google.maps.DirectionsRenderer({ map: googleMapInstance }));
    }, [mapsAPI, googleMapInstance]);

    useEffect(() => {
        if (!directionServiceInstance || !directionsRendererInstance) return;

        directionServiceInstance.route({
            origin: startLocation,
            destination: endLocation,
            waypoints: stopoverPoints,
            travelMode: window.google.maps.TravelMode.DRIVING,
        }).then(response => {
            directionsRendererInstance.setDirections(response);
        }).catch(error => {
            console.error(error);
        });
    }, [directionServiceInstance, directionsRendererInstance, route]);

    return <div></div>;
}
