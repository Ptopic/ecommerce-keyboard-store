import React from 'react';
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	Tooltip,
	useMapEvent,
	useMap,
} from 'react-leaflet';

import { FaMapMarkerAlt } from 'react-icons/fa';

// Icons
import markerIcon from '../../assets/icons/marker.png';
import { Icon } from 'leaflet';

function Markers({ position, zoomLevel }) {
	const map = useMap();

	console.log(position);

	const marker = new Icon({
		iconUrl: markerIcon,
		iconSize: [36, 36],
	});

	return (
		<Marker
			position={position}
			icon={marker}
			eventHandlers={{
				click: () => {
					map.setView([position[0], position[1]], zoomLevel);
				},
			}}
		/>
	);
}

export default Markers;
