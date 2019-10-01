import React from 'react';
//import EZMap from '../EZMap/Map.js';
//import { geolocated } from 'react-geolocated';
//import { compose } from 'redux';
//import { GoogleApiWrapper } from 'google-maps-react';

const TrackPioneer = (props) => {	
	//const { orderNumber } = this.props.match.url;
	//const { google, api } = this.props;
		
	return (
		<div className="container">
			<div className="row">
				<div className="col s8">
					<h1 className="flow-text">Pioneer Pizza</h1>						
					<p className="flow-text">Track Order Below</p>
				</div>
			</div>
			<div className="row">
				<div className="col s12">
					
				</div>
			</div>
		</div>
	)
}

//<EZMap ui="pioneer" trackNumber={orderNumber} />
export default TrackPioneer

/*export default compose(
        geolocated({
			positionOptions: {
				enableHighAccuracy: true,
				maximumAge: 60000
			},
			watchPosition: true,
			userDecisionTimeout: 30000,
			suppressLocationOnMount: false,
			geolocationProvider: navigator.geolocation
		}),
		GoogleApiWrapper({
			apiKey: 'AIzaSyDl3ed_01AJddUuFzJuPoX-LScqqB6nkT4',
			region: 'KN',
			LoadingContainer: <div className="progress"><div className="indeterminate"></div></div>
		})
)(TrackPioneer) */
