import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import ReactDOM from 'react-dom';
import usericon from '../../assets/images/blue-location.png'
import busicon from '../../assets/images/bus-marker-2.png'
import moment from 'moment'
import Preloader from '../Misc/Preloader';

export class MapContainer extends Component{
    componentWillUnmount(){
        const { firestore } = this.props;

        // Stop listening to changes
        this.unsubscribe();
    }

    onCollectionUpdate = querySnapshot => {
        const dispatches = []
        querySnapshot.forEach(document => {
            console.log('user');
        })
        // this.props.handleDispatchUpdate(dispatches)
        this.setState({ loading: false })
      }

    constructor(props){
        super(props);
        const { userCoords, isGeolocationEnabled, isGeolocationAvailable, firebase} = this.props;
        
        this.ref = firebase.firestore().collection('users');

        // Global variables
        this.mapCenter = {lat: 17.294219, lng: -62.725735};
        this.markerCluster = null;
        this.globalMarker = {
            markerAPI: [],
            markerList: [],
            infoWindowAPI: []
        };
        this.state = {
            currentLocation: this.mapCenter,
            defaultLocation: {lat: 17.294219, lng: -62.294219}
        };
        this.iconLegend = {
            user: {
              name: 'User Position',
              icon: usericon,
              type: 'img'
            },
            bus: {
              name: 'Bus Position',
              icon: busicon,
              type: 'img'
            },
            busicon: {
                name: 'Bus',
                icon: '<i class="material-icons">directions_bus</i>',
                type: 'icon'
            },
            position: {
                name: 'Location',
                icon: '<i class="material-icons">gps_fixed</i>',
                type: 'icon'
            },
            time: {
                name: 'Time of location',
                icon: '<i class="material-icons">alarm</i>',
                type: 'icon'
            }
        };
        
        if(!isGeolocationAvailable){
			console.log('Your browser does not support Geolocation');
		} else{
			if(!isGeolocationEnabled){
				console.log('Geolocation is not enabled');
			} else{
				if(userCoords){
					if(userCoords.latitude === 17.1274104 || userCoords.longitude === -61.846771999999994){
						console.log('user coords incorrect!');
					} else{
                        console.log('got user coords');
                        this.mapCenter = {lat: userCoords.latitude, lng: userCoords.longitude};
					}
					
				}
			}
        }
        
    }

	componentDidMount(){
        this.loadMap();
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    componentDidUpdate(prevProps){
        if(this.props !== prevProps.props){
            const { isGeolocationAvailable, isGeolocationEnabled, userCoords } = this.props;
            if(!isGeolocationAvailable){
                console.log('Your browser does not support Geolocation');
            } else{
                if(!isGeolocationEnabled){
                    console.log('Geolocation is not enabled');
                } else{
                    if(userCoords){
                        if(userCoords.latitude === 17.1274104 || userCoords.longitude === -61.846771999999994){
                            console.log('user coords incorrect!');
                        } else{
                            console.log('got user coords');
                            this.mapCenter = {lat: userCoords.latitude, lng: userCoords.longitude};
                        }
                        
                    }
                }
            }
        }
        
    }
    
    loadMap(){
        if (this.props && this.props.google){
            const { google } = this.props;
            const currentLocation = this.mapCenter;

            // google is available
            const maps = google.maps;
            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);
            const mapOptions = {
                center: currentLocation,
                zoom: 15,
                gestureHandling: 'greedy',
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: true,
                fullscreenControl: true,
                minZoom: 11,
                maxZoom: 18,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'styled_map']
                }
            }

            const mapConfig = Object.assign({}, mapOptions);
            //Load map to DOM
            this.map = new maps.Map(node, mapConfig);
            
            // this.map.setTilt(45);
            // this.map.mapTypes.set('styled_map', styledMapType);
            // this.map.setMaxBounds(this.map.getBounds());
            this.map.setMapTypeId('hybrid');
            // Add a marker clusterer to manage the markers.
            // let MarkerClusterer = window.MarkerClusterer;
            // this.gooo = new MarkerClusterer(this.map, this.globalMarker.markerAPI);
            this.map.addListener('click', () => this.removeWindows(this.globalMarker));
            
            let icon = {
                url: usericon,
                anchor: new google.maps.Point(15,32),
                scaledSize: new google.maps.Size(32,32)
            };
            //console.log(currentLocation, this.state.defaultLocation);
            if(currentLocation.lat !== this.state.defaultLocation.lat){
                // Create a marker and set user position.
                new google.maps.Marker({
                    map: this.map,
                    position: currentLocation,
                    title: 'Current Location',
                    icon: icon
                });
            }

            //Create Legend
            var legend = document.getElementById('legend');
            var list = document.createElement('ul');
            for (var key in this.iconLegend) {
                var type     = this.iconLegend[key],
                    name     = type.name,
                    iconImg  = type.icon,
                    iconType = type.type;
                
                var li = document.createElement('li');
                li.innerHTML = (iconType === 'img') ? '<img src="' + iconImg + '"> ' + name : iconImg + ' ' + name;
                list.appendChild(li);
            }
            legend.appendChild(list);
            this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
            
        }
        
        this.initMarkers();
    }

    removeWindows(globalMarker){
        globalMarker.infoWindowAPI.forEach( infowindow => {
            infowindow.close();
        });
    }

    initMarkers(){
        const { firestore } = this.props;

        firestore.collection('busGEO').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            // console.log('spanshot',changes);
            // deleteMarkers();
            changes.forEach(change => {
                // console.log('busGEO data change', change.doc.data());
                let snapType    = change.type,
                    busId       = change.doc.id,
                    bus         = change.doc.data(),
                    busDetails  = (bus.details) ? bus.details : '',
                    busCoords   = bus.coords,
                    gpsState    = bus.gpsState;
        
                if(snapType === 'added'){
                    // console.log('new bus', bus);
                    if(gpsState && gpsState === 1){
                        let data = {
                            id: busId,
                            details: busDetails,
                            coords: busCoords,
                            gpsState
                        }
                        this.addMarker(data);
                    }
                } else if(snapType === 'modified'){
                    console.log('bus modified: ', bus);
                    
                    let listId,
                        listindex = 0,
                        found = false;

                    //find out which id in array the marker is to edit
                    this.globalMarker.markerList.forEach((marker) => {
                        // console.log(this.globalMarker.markerList);
                        // console.log('comparing', marker.busId, busId)
                        if(marker.busId === busId){
                            console.log('found in marker list');
                            listId = listindex;
                            found = true;
                        }
                        listindex++;
                    });

                    //if already on map edit else add
                    if(found === true){
                        // console.log(this.globalMarker.markerList);
                        if(gpsState && gpsState === 1){
                            console.log('edit on map');
                            let myinfoWindow = this.globalMarker.infoWindowAPI[listId];
                            let myMarker = this.globalMarker.markerAPI[listId];
                            let myBus = this.globalMarker.markerList[listId];
                            
                            myBus.coords = busCoords;
                            myBus.details = busDetails;
                            myMarker.setPosition(busCoords);
                            myMarker.setTitle(busDetails.name);
                            this.setInfoDetails(myinfoWindow, bus, myMarker)
                        } else{
                            console.log('remove from map');
                            this.globalMarker.markerAPI[listId].setMap(null);
                            this.globalMarker.markerAPI.splice(listId, 1);
                            this.globalMarker.markerList.splice(listId, 1);
                            this.globalMarker.infoWindowAPI.splice(listId, 1);
                            console.log('markers ', this.globalMarker.markerAPI.length);
                        }
                    } else{
                        if(gpsState && gpsState === 1){
                            console.log('new marker');
                            let data = {
                                id: busId,
                                details: busDetails,
                                coords: busCoords,
                                gpsState
                            }
                            this.addMarker(data);
                        }
                    }
                }
            });
        });
    }

    addMarker(bus){
        // add bus marker on map
        // console.log('adding marker', bus);
        const { google } = this.props;

        let icon = {
            url: busicon,
            anchor: new google.maps.Point(15,32),
            scaledSize: new google.maps.Size(32,32)
        };
        // console.log(google.maps.Animation);
        // Create a marker and set its position.
        var busMarker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(bus.coords.lat, bus.coords.lng),
            title: bus.details.busName,
            icon: icon,
            animation: google.maps.Animation.DROP,
        });

        busMarker.addListener('click', toggleBounce);

        function toggleBounce() {
            function stopBounce(busMarker) {
                busMarker.setAnimation(null);
            }

            if (busMarker.getAnimation() !== null) {
                busMarker.setAnimation(null);
            } else {
                busMarker.setAnimation(google.maps.Animation.BOUNCE);
                window.setTimeout(stopBounce(busMarker), 1000);
            }
        }

        // add busmarker list to array
        this.globalMarker.markerList.push({
            busId: bus.id,
            details: bus.details,
            coords: bus.coords
        }); 
        this.globalMarker.markerAPI.push(busMarker); //add marker object to array
    
        // Check content
        if(bus.details){
            //Add infowindow
            var infoWindow = new google.maps.InfoWindow({
                content: null,
                maxWidth: 500
            });

            //set which marker the listener should attach to from global array
            let thelength = this.globalMarker.markerAPI.length - 1;
            let globalBusMarker = this.globalMarker.markerAPI[thelength];
            let globalBuslength = this.globalMarker.markerList.length - 1;
            //let globalBusDetails = this.globalMarker.markerList[globalBuslength];
            
            const Info = (infoWindow, bus, busMarker) => {
                this.globalMarker.infoWindowAPI.forEach( infowindow => {
                    infowindow.close();
                });
                this.setInfoDetails(infoWindow, bus, busMarker);
                infoWindow.open(this.map, busMarker);
            }

            busMarker.addListener('click', () => Info(infoWindow, this.globalMarker.markerList[globalBuslength], globalBusMarker));
            this.globalMarker.infoWindowAPI.push(infoWindow); // add info window object to array
        }
        
        console.log('markers ', this.globalMarker.markerAPI.length);
    }

    setInfoDetails = (infoWindow, bus, busMarker) => {
        const { google }    = this.props;
        const geocoder      = new google.maps.Geocoder();
        
        if(bus){
            let AddressName     = '',
                busName         = bus.details.busName,
                busNumber       = bus.details.busNumber,
                busEnd          = bus.details.busEnd,
                coordTime       = bus.coords.time,
                position        = {
                    lat: busMarker.getPosition().lat(),
                    lng: busMarker.getPosition().lng()
                },
                innerHTML;
            
            //GOOGLE Geolocation API
            if(bus.coords.lat !== 0){
                geocoder.geocode({'location': position}, function (results, status){
                    GeoDetails(results, status);
                });
            }

            //Insert details from google api to info window
            function GeoDetails(results, status, busMarker){
                innerHTML = '<div class="myinfowindow">';
                innerHTML += '<h5 class="info-title"><i class="material-icons">directions_bus</i>'+ busName +'</h5>';
                innerHTML += '<div class="info-content">';
                innerHTML += '<h5>' + busNumber + ' | ' + busEnd + ' - Town</h5>';

                if (status === 'OK'){
                    if (results[0]){
                        // console.log(results[0]);
                        let resultAddress = results[0].address_components;
                        let i = 1;
                        const wrongName     = ['Unnamed Road', 'Brumaire', '300', 'P.O. Box 699, Basseterre', 'KN', 'St. Kitts', 'Saint Anne Sandy Point Parish', 'Saint Thomas Middle Island Parish', 'Saint George Basseterre Parish', 'Trants', 'Saint Paul Capisterre Parish', 'super', 'Trinity Palmetto Point Parish'],
                            defaultPOB    = 'Trinity Parish',
                            defaultST     = 'St. Thomas Parish',
                            defaultSP     = 'Sandy Point',
                            defaultTown   = 'Basseterre',
                            defaultSTP    = 'St. Paul Parish',
                            defaultTrants = 'Newton Ground';
                        let finalRoad = (roadName) => {
                            let nameStatus = wrongName.indexOf(roadName);
                            
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
                        
                        innerHTML += '<span className="LocationInfo"><i class="material-icons tiny">gps_fixed</i> ' + AddressName  + '</span>';
                        
                    } else {
                        console.log('No results found');
                        innerHTML += 'No results found';
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                    innerHTML += 'Geocoder failed due to: ' + status;
                }

                innerHTML += (coordTime) ? '<span><i class="material-icons tiny">alarm</i> ' + moment(coordTime.toDate()).fromNow() + '</span>' : '';
                innerHTML += '</div></div>';
                
                infoWindow.setContent(innerHTML); // Set content for info window
            }
        }
    }

	render() {
        const style = {
            width: '100%',
            height: '94vh'
        }
		return (
			<div>
                <div ref='map' style={style}>
                    <Preloader />
                </div>
                <div id="legend"><h5 className="legend-title">Legend</h5></div>
            </div>
		);
	}
}

const mapToStateToProps = (state) => {
    return{
		busGEO: state.firestore.ordered.MyRide
    }
}

export default compose(
	connect(mapToStateToProps),
	firestoreConnect()
)(MapContainer);