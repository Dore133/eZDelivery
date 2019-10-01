export const activeLink = (e) => {
    return () =>{
        console.log(e);
        
        // this.classList.add("active");
        // const element = document.querySelector("#theLink");

        // element.addEventListener('click', event => {
        //     console.log('link clicked');
            
        //     element.classList.remove("active");
            
        // });
    }
}

export const getDistance = (bus, GEOlocation) => {
    return () => {
        // let { busGEO, GEOlocation } = this.props;
        const google = GEOlocation.google;
        var service = new google.maps.DistanceMatrixService();
        let busDistance, busDuration; 
        let x = {};

        if(GEOlocation.coords){
            // console.log('got user coords distance cal');
            // console.log(userCoords);
            service.getDistanceMatrix({
                origins: [{ lat: GEOlocation.coords.latitude, lng: GEOlocation.coords.longitude }],
                destinations: [bus.coords],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, callback);
            
            function callback(response, status) {
                console.log('getDistanceMatrix', response, status);
                if(status === 'OK'){
                    busDistance = response.rows[0].elements[0].distance.text;
                    busDuration = response.rows[0].elements[0].duration.text;
                    x.busDistance = busDistance;
                    x.busDuration = busDuration;
                    x.err = false;
                } else{
                    console.log('Error calculating distance');
                    x.err = 'Error calculating distance';
                }
            }
        } else{
            console.log('Coordinates not available can\'t calculate distance');
            x.err = 'Coordinates not available can\'t calculate distance';
        }
        // console.log('busses',x);
        return x;
    }
}

export const ManageFav = (busId, listType) => {
    return (dispatch, getState, {getFirebase}) => {
        window.M.Toast.dismissAll();
        const firebase      = getFirebase();
        let userId          = firebase.auth().currentUser.uid;
        const firebaseRef   = firebase.database().ref('/FavBus/' + userId);
        let toastContent    = (listType === 'Fav') ? 'Removed from Fav List!' : 'Added to Fav List!';
        let toastSUCCESS    = '<span>'+toastContent+'</span><button class="btn-flat toast-action">Undo</button>';
        let toastFOUND      = '<span>Already in Favs!</span>';
        let fbBusIdz;
        console.log('managing fav', listType);
        
        if(listType === 'Fav'){
            console.log('removing fav');

            firebaseRef.once('value').then((snapshot) => {
                // console.log(snapshot.val());
                
                fbBusIdz = (snapshot.val()) ? snapshot.val() : null;

                if(fbBusIdz){
                    const favList = fbBusIdz.filter(item =>{
                        return item !== busId;
                    });
                    
                    firebaseRef.set(
                        favList
                    ).then(() => {
                        window.M.toast({html: toastSUCCESS});
                        return true
                    }).catch((err) => {
                        dispatch({ type: 'FAV_ERROR', err});
                    });
                } 
                
            });
        } else{
            firebaseRef.once('value').then((snapshot) => {
                // console.log(snapshot.val());
                
                fbBusIdz = (snapshot.val()) ? snapshot.val() : null;
                let data = [];
                let found = false;
                console.log('fav bus ids',fbBusIdz);

                if(fbBusIdz){
                    //find out which id in array the marker is to edit
                    fbBusIdz.forEach((bus) => {
                        if(bus === busId){
                            console.log('found in bus list');
                            found = true;
                        }
                    });

                    if(found){
                        window.M.toast({html: toastFOUND});
                    } else{
                        data = [...fbBusIdz, busId];

                        firebaseRef.set(
                            data
                        ).then(() => {
                            window.M.toast({html: toastSUCCESS});
                            return true
                            //dispatch({ type: 'FAV_ADDED' });
                        }).catch((err) => {
                            dispatch({ type: 'FAV_ERROR', err});
                        });
                    }
                } else{
                    data.push(busId);

                    firebaseRef.set(
                        data
                    ).then(() => {
                        window.M.toast({html: toastSUCCESS});
                        return true
                        //dispatch({ type: 'FAV_ADDED' });
                    }).catch((err) => {
                        dispatch({ type: 'FAV_ERROR', err});
                    });
                }
                
            });
           
        }
        
    }
}

export const getCardinal = (angle) => {
    return () => {
        //easy to customize by changing the number of directions you have 
        var directions  = 8;
        var degree      = 360 / directions;
            angle       = angle + degree / 2;
        
        if (angle >= 0 * degree && angle < 1 * degree) return "North";
        if (angle >= 1 * degree && angle < 2 * degree) return "North East";
        if (angle >= 2 * degree && angle < 3 * degree) return "East";
        if (angle >= 3 * degree && angle < 4 * degree) return "South East";
        if (angle >= 4 * degree && angle < 5 * degree) return "South";
        if (angle >= 5 * degree && angle < 6 * degree) return "South West";
        if (angle >= 6 * degree && angle < 7 * degree) return "West";
        if (angle >= 7 * degree && angle < 8 * degree) return "North West";
        
        //Should never happen: 
        return "something wrong";
    }
}

export const mapAction = (action) => {
    return () => {
        window.M.Toast.dismissAll();
        let toastContent = 'Do Action';
        switch (action) {
            case 'Fav':
                toastContent = 'Show only Favourites';
                break
            case 'NearMe':
                toastContent = 'Show Nearest Buses';
                break
            case 'Location':
                toastContent = 'Get user location';
                break
            default:
                break;
        }
        window.M.toast({
            html: '<span>'+toastContent+'</span>',
            displayLength: 1500
        });
    }
}

export const initMaterial = (direction) => {
    return () => {
        window.M.AutoInit();
    }
}

export const getUserCoords = (props) => {
    return () => {
        // console.log('getting coords', props);
        let userAccess, locationAvailable, locationEnabled, userCoords = false;
        const { coords, isGeolocationEnabled, isGeolocationAvailable } = props;
        if(!isGeolocationAvailable){
            console.log('Your browser does not support Geolocation');
            locationAvailable = false;
		} else{
            locationAvailable = true;
			if(!isGeolocationEnabled){
                console.log('Geolocation is not enabled');
                locationEnabled = false;
			} else{
                locationEnabled = true;
				if(coords){
                    userAccess = true;
					if(coords.latitude === 17.1274104 || coords.longitude === -61.846771999999994){
						console.log('user coords incorrect!');
					} else{
                        console.log('got user coords');
                        userCoords = {lat: coords.latitude, lng: coords.longitude};
					}
				} else{
                    userAccess = false;
                }
			}
        }

        let data = {
            userAccess,
            locationAvailable,
            locationEnabled,
            userCoords
        }

        return data
    }
}
