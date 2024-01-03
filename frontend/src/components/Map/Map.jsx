import React from 'react';
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
} from 'react-google-maps';

const Map = withScriptjs(
	withGoogleMap((props) => (
		<GoogleMap defaultZoom={14} defaultCenter={props.cordinates}>
			<Marker position={props.cordinates} />
		</GoogleMap>
	))
);

export default Map;
