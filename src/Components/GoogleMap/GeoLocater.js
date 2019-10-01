import React from 'react'
import moment from 'moment'

const GeoLocater = (props) => {

    const { position, google, coordTime, name } = props;
    const geocoder = new google.maps.Geocoder();
    // const timeID = new Date().getTime();
    let AddressName = '';
    
    //GOOGLE Geolocation API
    if(position.lat !== 0){
        geocoder.geocode({'location': position}, function (results, status){
            GeoDetails(results, status);
        });
    }

    //Insert details from google api to info window
    function GeoDetails(results, status){
        if (status === 'OK') {
            if (results[0]) {
                // console.log(results[0]);
                const ptag = document.querySelector('.myinfowindow');
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

                if(ptag){
                    // console.log('ptag', AddressName, AddressName.trim().length);
                    
                    ptag.innerHTML = '';
                    ptag.innerHTML = '<h5>'+ name +'</h5>';
                    ptag.innerHTML += '<span className="LocationInfo"><i class="material-icons tiny">directions_bus gps_fixed</i>  ' + AddressName  + '</span>';
                    ptag.innerHTML += (coordTime) ? moment(coordTime.toDate()).calendar() : '';
                }

            } else {
                console.log('No results found');
            }
        } else {
            console.log('Geocoder failed due to: ' + status);
        }
    }

    return (
        <span></span>
    )
}

export default GeoLocater