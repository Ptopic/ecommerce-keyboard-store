import React, { useState, useRef, useEffect } from 'react';

import './Map.css';

import Map, {
	Marker,
	NavigationControl,
	GeolocateControl,
	FullscreenControl,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function CustomMap({ lat, lng }) {
	const mapboxApiKey = import.meta.env.VITE_MAPBOX;

	return (
		<Map
			mapLib={import('mapbox-gl')}
			initialViewState={{
				longitude: lng,
				latitude: lat,
				zoom: 15,
			}}
			style={{ width: '100%', height: 400 }}
			mapStyle="mapbox://styles/mapbox/streets-v9"
			mapboxAccessToken={mapboxApiKey}
		>
			<Marker
				longitude={lng}
				latitude={lat}
				anchor="bottom"
				pitchAlignment="viewport"
				color="#E81123"
			></Marker>
			<NavigationControl position="top-left" />
			<GeolocateControl />
			<FullscreenControl />
		</Map>
	);
}

export default CustomMap;
