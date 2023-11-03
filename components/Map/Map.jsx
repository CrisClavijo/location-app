'use client'

import React from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import style from '../../app/page.module.css';
import LocationMarker from "./SelectedPoints"

const Map = ({ updateArrayPoligon, zoom, newPoligon, allData, selectedPoints, color, zoomValue }) => {

    const purpleOptions = { color: 'blue' }
    const limeOptions = { color: `${color}` }

    return (
        <div>
            <MapContainer className={style.map} center={[23.6345, -102.5528]} zoom={zoomValue} >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {selectedPoints ?
                    (<>
                        <LocationMarker zoom={zoom} updateArrayPoligon={updateArrayPoligon} newPoligon={newPoligon} />
                    </>) : null}
                <Polygon pathOptions={purpleOptions} positions={newPoligon} />
                {allData?.map((item, id) => {
                    return (
                        <div key={id}>
                            <Polygon pathOptions={limeOptions} positions={item.location} >
                                <Tooltip>
                                    {item.subName}
                                    <div>{item.sizeLocation} hectareas</div>
                                </Tooltip>
                            </Polygon>
                        </div>
                    )
                })}
            </MapContainer>

        </div>
    );
}
export default Map;