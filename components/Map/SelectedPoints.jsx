import React, { useState } from 'react';
import { Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import IconMarker from './marker.svg';
const LocationMarker = ({ updateArrayPoligon, newPoligon, zoom }) => {
    const [position, setPosition] = useState(null);

    const map = useMapEvents({
        mousedown(e) {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng);
            updateArrayPoligon([...newPoligon, [lat, lng]]);
            getZoomLevel()
        },
    })

    const mapZoom = useMap(); // Accede al objeto MapContainer

    // Función para obtener el nivel de zoom actual
    const getZoomLevel = () => {
      const currentZoom = mapZoom.getZoom();
      zoom(currentZoom)
      
    };

    const icon = new Icon({
        iconUrl: IconMarker,
        iconSize: [40, 40]
    })

    return position === null ? null : (
        <Marker position={position} icon={icon}>
            <Popup>
                <div>lat: {position.lat}</div>
                <div>lng: {position.lng}</div>
            </Popup>
        </Marker>
    )
}

export default LocationMarker;