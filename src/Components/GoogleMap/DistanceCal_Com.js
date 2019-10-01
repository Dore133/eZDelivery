import React, { Component } from 'react'

export class DistanceCalculater extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            busDistance: null,
            busDuration: null
        };
    }

    // componentDidUpdate(prevProps) {
    //     // Typical usage (don't forget to compare props):
    //     if (this.props.busGEO !== prevProps.busGEO) {
    //         let { busGEO, GEOlocation } = this.props;
    //         const google = GEOlocation.google;
    //         var service = new google.maps.DistanceMatrixService();
    //         let busDistance, busDuration; 

    //         // Check gps status and show distance if its available
    //         if(!GEOlocation.isGeolocationAvailable){
    //             console.log('Your device does not support Geolocation');
    //             //document.getElementById('distanceInfo'+busGEO.id).innerHTML = 'Your device does not support Geolocation can\'t calculate distance';
    //         } else{
    //             if(!GEOlocation.isGeolocationEnabled){
    //                 console.log('Geolocation is not enabled');
    //                 //document.getElementById('distanceInfo'+busGEO.id).innerHTML = 'Geolocation is not enabled can\'t calculate distance';
    //             } else{
    //                 if(GEOlocation.coords){
    //                     // console.log('got user coords distance cal');
    //                     // console.log(userCoords);
    //                     service.getDistanceMatrix({
    //                         origins: [{ lat: GEOlocation.coords.latitude, lng: GEOlocation.coords.longitude }],
    //                         destinations: [busGEO.coords],
    //                         travelMode: 'DRIVING',
    //                         unitSystem: google.maps.UnitSystem.METRIC,
    //                         avoidHighways: false,
    //                         avoidTolls: false
    //                     }, callback);
                        
    //                     function callback(response, status) {
    //                         // console.log(response, status);
    //                         if(status === 'OK'){
    //                             busDistance = response.rows[0].elements[0].distance.text;
    //                             busDuration = response.rows[0].elements[0].duration.text;
    //                             handleState(busDistance, busDuration);
    //                         } else{
    //                             console.log('Error calculating distance');
    //                         }
    //                     }
    //                 } else{
    //                     console.log('Coordinates not available can\'t calculate distance');
    //                 }
    //             }
    //         }

    //         const handleState = (busDistance, busDuration) => {
    //             this.setState({
    //                 busDistance,
    //                 busDuration
    //             });
    //         }
    //     }
    // }

    componentDidMount(){
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
					// console.log('got user coords distance cal');
					// console.log(userCoords);
                    service.getDistanceMatrix({
                        origins: [busGEO.coords],
                        destinations: [{ lat: GEOlocation.coords.latitude, lng: GEOlocation.coords.longitude }],
                        travelMode: 'DRIVING',
                        unitSystem: google.maps.UnitSystem.IMPERIAL,
                        avoidHighways: false,
                        avoidTolls: false
                    }, callback);
                    
                    function callback(response, status) {
                        // console.log(response, status);
                        if(status === 'OK'){
                            busDistance = response.rows[0].elements[0].distance.text;
                            busDuration = response.rows[0].elements[0].duration.text;
                            handleState(busDistance, busDuration);
                        } else{
                            console.log('Error calculating distance');
                        }
                    }
				} else{
                    console.log('Coordinates not available can\'t calculate distance');
                }
			}
        }

        const handleState = (busDistance, busDuration) => {
            this.setState({
                busDistance,
                busDuration
            });
        }
    }
    
    render() {
        let { busDistance, busDuration } = this.state;
        let theDistance = null,
            theDuration = null;
        
        if(busDistance !== '' && busDistance !== null){
            theDistance = <span id={"busDistance"}><i className="material-icons tiny">location_on</i> {busDistance}</span>;
        } 

        if(busDuration !== '' && busDuration !== null){
            theDuration = <span id={"busDuration"}> <i className="material-icons tiny">timelapse</i> {busDuration}</span>;
        } 

        if(theDuration === null && theDistance === null){
            return (
                <p></p>
            )
        }

        return (
            <p className='distanceInfo' id={'distanceInfo'}>
            {theDistance} | {theDuration} away
            </p>
        )
    }
}

export default DistanceCalculater