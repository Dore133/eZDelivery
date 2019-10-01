import React, { Component } from 'react'

export class DistanceCalculater extends Component {
    
    render() {
        // console.log(this.props.google);
        
        let { busGEO, GEOlocation } = this.props;
        const google = GEOlocation.google;
        var service = new google.maps.DistanceMatrixService();
        let busDistance, busDuration; 

        // Check gps status and show distance if its available
        if(!GEOlocation.isGeolocationAvailable){
			console.log('Your device does not support Geolocation');
			//document.getElementById('distanceInfo'+busGEO.id).innerHTML = 'Your device does not support Geolocation can\'t calculate distance';
		} else{
			if(!GEOlocation.isGeolocationEnabled){
				console.log('Geolocation is not enabled');
				//document.getElementById('distanceInfo'+busGEO.id).innerHTML = 'Geolocation is not enabled can\'t calculate distance';
			} else{
				if(GEOlocation.coords){
					console.log('got user coords distance cal');
					// console.log(userCoords);
                    service.getDistanceMatrix({
                        origins: [{ lat: GEOlocation.coords.latitude, lng: GEOlocation.coords.longitude }],
                        destinations: [busGEO.coords],
                        travelMode: 'DRIVING',
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false
                    }, callback);
                    
                    function callback(response, status) {
                        // console.log(response, status);
                        if(status === 'OK'){
                            busDistance = response.rows[0].elements[0].distance.text;
                            busDuration = response.rows[0].elements[0].duration.text;
                            document.getElementById("busDistance"+busGEO.id).innerHTML = '<i class="material-icons tiny">location_on</i>'+busDistance;
                            document.getElementById("busDuration"+busGEO.id).innerHTML = ' | <i class="material-icons tiny">timer</i>'+busDuration;
                        } else{
                            document.getElementById('distanceInfo'+busGEO.id).innerHTML = 'Error calculating distance';
                        }
                    }
				} else{
                    document.getElementById('distanceInfo'+busGEO.id).innerHTML = 'Coordinates not available can\'t calculate distance';
                }
			}
        }

        return (
            <p className='distanceInfo' id={'distanceInfo'+busGEO.id}>
                <span id={"busDistance"+busGEO.id}></span> 
                <span id={"busDuration"+busGEO.id}></span>
            </p>
        )
    }
}

export default DistanceCalculater