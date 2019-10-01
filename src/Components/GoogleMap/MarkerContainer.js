import React, { Component } from 'react'
import { Marker } from 'google-maps-react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import busicon from '../../assets/images/bus-marker-2.png'

class MarkerContainer extends Component {
    constructor(props){
		super(props);

		const { busGEO, google, userCoords } = this.props;
		this.state = {
			busGEO,
			google,
			userCoords,
			busPosition: null,
			userPosition: null,
			mapCenter: {lat: 17.339716, lng: -62.803453}
		}
	}

    render(){
        const { busGEO, google } = this.props;
        // console.log('busgeo changed', this.props, this.state);
        
        let busPosition = [];
        // let newPosition = [];

        if(busGEO){
            console.log(busGEO);
            
            busGEO.forEach(bus => {
                let gpstate = bus.gpsState;
                if(gpstate && gpstate === 1){
                    busPosition.push(
                        <Marker position={bus.coords} 
                                key={bus.id} 
                                //onClick={this.onMarkerClick} 
                                name={bus.name} 
                                icon={{url: busicon,
                                    anchor: new google.maps.Point(15,32),
                                    scaledSize: new google.maps.Size(32,32)}}  
                                title={bus.name}
                        />
                    );
                } 
            });
        }
        return (
            <div>
                {busPosition}
            </div>
        )
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
            collection: 'busGEO',
            // where: ['status', '==', true]
        }
    ])
)(MarkerContainer);