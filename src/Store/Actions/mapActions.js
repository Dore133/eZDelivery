export const AddFav = (id) => {
    return(dispatch, getState, { getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        let uid = getState().firebase.auth.uid;
        
        firestore.collection('fav').doc(id).set({
            ...message,
            createdAt: new Date()
        }).then(() => {
            dispatch({type: 'FAV_SUCCESS'});
        }).catch((err) => {
            dispatch({type: 'FAV_ERROR', err});
        });
    }
}

export const GeoLocater = (bus) => {
    console.log('running locater');
    
    const { google } = this.props;
    const geocoder = new google.maps.Geocoder();
    // const timeID = new Date().getTime();
    let AddressName = '';
    const position = bus.coords,
        name = bus.details.busName,
        coordTime = bus.coords;
    
    //GOOGLE Geolocation API
    if(position.lat !== 0){
        geocoder.geocode({'location': position}, function (results, status){
            return GeoDetails(results, status);
        });
    }

    //Insert details from google api to info window
    function GeoDetails(results, status){
        if (status === 'OK') {
            if (results[0]) {
                // console.log(results[0]);
                let resultAddress = results[0].address_components;
                let i = 1;
                const wrongName = ['Unnamed Road', 'Brumaire', '300', 'P.O. Box 699, Basseterre', 'KN', 'St. Kitts', 'Saint Anne Sandy Point Parish', 'Saint Thomas Middle Island Parish', 'Saint George Basseterre Parish', 'Trants', 'Saint Paul Capisterre Parish', 'super', 'Trinity Palmetto Point Parish']
                const defaultPOB = 'Trinity Parish';
                const defaultST = 'St. Thomas Parish';
                const defaultSP = 'Sandy Point';
                const defaultTown = 'Basseterre';
                const defaultSTP = 'St. Paul Parish'
                const defaultTrants = 'Newton Ground';
                let finalRoad = (roadName) => {
                    let nameStatus = wrongName.indexOf(roadName);
                    
                    // console.log(nameStatus,roadName);
                    switch (nameStatus) {
                        case 3:
                            return defaultPOB
                        case 12:
                            return defaultPOB
                        case 10:
                            return defaultSTP
                        case 9:
                            return defaultTrants
                        case 8:
                            return defaultTown
                        case 7:
                            return defaultST
                        case 6:
                            return defaultSP
                        case -1:
                            return roadName
                        default:
                            return ''
                    }
                }
                
                // Filter through road name
                resultAddress.forEach(result => {
                    AddressName += (i !== 1) ? ' ': '';
                    // console.log(result.short_name);
                    let roadName = result.short_name;
                    
                    AddressName += finalRoad(roadName);
                    i++;
                });

                let finalGEO = '';
                finalGEO = '';
                finalGEO = '<h5>'+ name +'</h5>';
                finalGEO += '<span className="LocationInfo"><i class="material-icons tiny">directions_bus gps_fixed</i>  ' + AddressName  + '</span>';
                // finalGEO += (coordTime) ? moment(coordTime.toDate()).calendar() : '';
                // console.log(finalGEO);
                
                return finalGEO;

            } else {
                console.log('No results found');
                return null
            }
        } else {
            console.log('Geocoder failed due to: ' + status);
            return null
        }
    }
}