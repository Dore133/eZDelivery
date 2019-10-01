import React, { Component } from 'react';
import { Map, Marker, InfoWindow } from 'google-maps-react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import usericon from '../../assets/images/blue-location.png'
import busicon from '../../assets/images/bus-marker-2.png'
import GeoLocater from './GeoLocater'

const mapStyles = {
	width: '100%',
	height: '100%'
};

export class MapContainer extends Component {
	state = {
		showingInfoWindow: false,
		activeMarker: {},
		selectedPlace: {},
		markerLat: 0,
		markerLng: 0
	};

	onMarkerClick = (props, marker, e) => {
		
		this.setState({
			selectedPlace: props,
			activeMarker: marker,
			showingInfoWindow: true,
			markerLat: props.position.lat,
			markerLng: props.position.lng,
			markerTime: props.position.time
		});
		
	}

	onMapClicked = (props) => {
		if (this.state.showingInfoWindow) {
			this.setState({
				showingInfoWindow: false,
				activeMarker: null,
				markerLat: 0,
				markerLng: 0
			});
		}
	}

	componentDidMount(){
		console.log('component mounted!');
	}

	componentDidUpdate(nextProps){
		if(this.props.busGEO !== nextProps.busGEO){
			console.log('bus data changed!');
		}
	}

	render() {
		const { busGEO, google, userCoords } = this.props;
		let busPosition = [];
		let userPosition = [];
		let mapCenter = {lat: 17.339716, lng: -62.803453};

		if(busGEO){
			busGEO.forEach(bus => {
				// let lastUpdate = bus.coords.time;
				let gpstate = bus.coords.gpsState;
				// let now = new Date().getTime();
				// let offStatus = 180000;
				// console.log(lastUpdate, now, (now - lastUpdate));
				
				// if((now - lastUpdate) < offStatus){
				if(gpstate && gpstate === 1){
					busPosition.push(
						<Marker position={bus.coords} 
								key={bus.id} 
								onClick={this.onMarkerClick} 
								name={bus.name} 
								icon={{url: busicon,
									anchor: new google.maps.Point(15,32),
									scaledSize: new google.maps.Size(32,32)}}  
								title={bus.name}
						/>
					);
					// console.log(bus.name, 'is running', busPosition[0]);
					// busPosition[0].props.position.lat = 17.3444
				} else{
					// console.log(bus.name, 'is inactive', busPosition);
				}
			});
		}
		
		if(!this.props.isGeolocationAvailable){
			console.log('Your browser does not support Geolocation');
		} else{
			if(!this.props.isGeolocationEnabled){
				console.log('Geolocation is not enabled');
			} else{
				if(userCoords){
					// console.log(userCoords);
					if(userCoords.latitude === 17.1274104 || userCoords.longitude === -61.846771999999994){
						console.log('user coords incorrect!');
					} else{
						mapCenter = {lat: userCoords.latitude, lng: userCoords.longitude};
						userPosition.push(
							<Marker position={mapCenter} 
									icon={{
										url: usericon,
										anchor: new google.maps.Point(0,32),
										scaledSize: new google.maps.Size(32,32)}}
									name="You are here"
									title="You are here"
									onClick={this.onMarkerClick} 
									key='userPositionGEO' 
							/>
						);
					}
					
				}
			}
		}
		
		return (
			<div>
				<Map google={google}
					zoom={13}
					style={mapStyles}
					initialCenter={mapCenter}
					onClick={this.onMapClicked}
					gestureHandling={'greedy'}
					zoomControl= {true}
					mapTypeControl= {false}
					scaleControl= {true}
					streetViewControl= {false}
					rotateControl= {true}
					fullscreenControl= {true}
					minZoom={12}
					maxZoom={18}
				>

					{busPosition}
					{userPosition}

					<InfoWindow
						marker={this.state.activeMarker}
						visible={this.state.showingInfoWindow} >
						<div className="content myinfowindow">
							{/* <h5>{this.state.selectedPlace.name}</h5> */}
							<GeoLocater 
								google={google} 
								position={{lat: this.state.markerLat, lng: this.state.markerLng}}
								coordTime={this.state.markerTime}
								name={this.state.selectedPlace.name}
							/>
						</div>
					</InfoWindow>

				</Map>
			</div>
		);
	}
}

const mapToStateToProps = (state) => {
    return{
		busGEO: state.firestore.ordered.busGEO
    }
}

export default compose(
	connect(mapToStateToProps),
	firestoreConnect((props) => [
        {
            collection: 'busGEO'
        }
    ])
)(MapContainer);