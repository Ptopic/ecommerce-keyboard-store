import React, { useState, useRef, useEffect } from 'react';
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	Tooltip,
	useMapEvent,
	useMap,
} from 'react-leaflet';

import './Map.css';
import 'leaflet/dist/leaflet.css';

import { Icon } from 'leaflet';
import Markers from './Markers';

function CustomMap({ lat, lng }) {
	const animateRef = useRef(false);
	const position = [lat, lng]; // [latitude, longitude]
	const zoomLevel = 15;

	function SetViewOnClick({ animateRef }) {
		const map = useMapEvent('click', (e) => {
			map.setView(e.latlng, map.getZoom(), {
				animate: animateRef.current || false,
			});
		});

		return null;
	}

	return (
		<MapContainer
			center={position}
			zoom={zoomLevel}
			scrollWheelZoom={true}
			style={{ height: '100%', minHeight: '100%' }}
		>
			<TileLayer
				// url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				// url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
				// url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
				url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=1DlZzIyN39Y2R6do9nYhrkaVLtsajCdqdEtD6DTdv4BIMTRJt1N9NQhiANngYsIn"
				//url="https://tile.jawg.io/3a731765-0ae8-4050-9470-c4a9b8aa035a/{z}/{x}/{y}{r}.png?access-token=1DlZzIyN39Y2R6do9nYhrkaVLtsajCdqdEtD6DTdv4BIMTRJt1N9NQhiANngYsIn"
			/>
			<SetViewOnClick animateRef={animateRef} />

			<Markers position={position} zoomLevel={zoomLevel} />
		</MapContainer>
	);
}

export default CustomMap;
